// TODO:
// TODO:
//An operator is a function that takes an observable and returns an observable

import { of } from "./creational-operators.js";
import { Observable } from "./observable.js";

type Operator<T, U> = (input$: Observable<T>) => Observable<U>;

//lets implement an operator 'double'

const double: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  //create the output observable .Its executor function
  //must read values of input and double them and feed them to the observer of output observable.
  //yout get a reference to it in the executor function

  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value != undefined) {
          observer.next(value * 2);
        }
      },
    });
    return () => {
      inputSubscription.unsubscribe();
    };
  });
  return output$;
};

const square: Operator<number, number> = (
  input$: Observable<number>,
): Observable<number> => {
  const output$ = new Observable((observer) => {
    const inputSubscription = input$.subscribe({
      next(value) {
        if (value != undefined) {
          observer.next(value * value);
        }
      },
    });
    return () => {
      inputSubscription.unsubscribe();
    };
  });
  return output$;
};

const first: Operator<unknown, unknown> = (
  input$: Observable<unknown>,
): Observable<unknown> => {
  //we should subscribe to input,read very first value ,and pass it
  // to the observer of the output observable and immediately  unsubscribe from input $
  const output$ = new Observable<unknown>((observer) => {
    let isFirstItemSeen = false;
    const subscription = input$.subscribe({
      next(value: unknown) {
        if (isFirstItemSeen) {
          return;
        } else {
          observer.next(value);
          isFirstItemSeen = true;
        }

        //soon after we consume the first value of input  we need to unsubscribe

        //we need to ensure we call unsubscribe inly in a  next event loop cycle .Otherwise this will be called without a proper value
        //for subscription being assigned.the reason is the values are being produced synchronously
        setTimeout(() => subscription.unsubscribe(), 0);
      },
    });
    return null;
  });
  return output$;
};
//we can actually chain these-compose or pipe
//we can create an observable that doubles and then squares a given observable,

// const anObservable$=of(1,2,3,4,5);

// const firstSquare$=first(square(double(anObservable$)))

const anObservable$ = of(1, 2, 3, 4);

const firstDoubledSquare$ = first(square(double(anObservable$)));
firstDoubledSquare$.subscribe({
  next(value) {
    console.log("From manual piping: ", value);
  },
});

const firstDoubledSquare1$ = anObservable$.pipe(double, square, first);
const fs = firstDoubledSquare1$.subscribe({
  next(value) {
    console.log("From observables piping: ", value);
  },
});
fs.unsubscribe();

//MAP IN PIPEABLE OPERATOR

const map = function <T, U>(transform: (value: T) => U): Operator<T, U> {
  //TODO
  //must return an operator that takes an input observable as an arguement,
  //and then applies the transform function on each value emitted by input observable and then emits the transformed value t the output observable's observer

  return (input$: Observable<T>): Observable<U> => {
    //create an output observable in its executor
    //need to observe the input observable For each value of input,
    //apply transform and then emit  the result to the output observable's observer
    const output$ = new Observable((observer) => {
      const inputSubscription = input$.subscribe({
        next(value) {
          if (value) {
            observer.next(transform(value));
          }
        },
      });
      return () => inputSubscription.unsubscribe();
    });
    return output$;
  };
};

const double1 = map<number, number>((value) => value * 2);
const square1 = map<number, number>((value) => value * value);

const structured = map<number, { value: number }>((value) => ({ value }));

const doubleSquare = of(11, 22, 33).pipe(double1, square1, structured);

doubleSquare.subscribe({
  next(value) {
    console.log(value);
  },
});

//FILTER IN PIPEable operator
type Predicate<T> = (value: T) => boolean;

const filter = function <T>(predicate: Predicate<T>): Operator<T, T> {
  return (input$: Observable<T>): Observable<T> => {
    const output$ = new Observable((observer) => {
      const inputSubscription = input$.subscribe({
        next(value: T) {
          if (predicate(value)) {
            observer.next(value);
          }
        },
      });
      return () => inputSubscription.unsubscribe();
    });
    return output$;
  };
};

const filterOdd = filter((value: number) => value % 2 != 0);

const squareOdd = of(11, 22, 33, 44).pipe(filterOdd, square1);
//const OddSquare = square(double(filterOdd(anObservable$)));

squareOdd.subscribe({
  next(value) {
    console.log(value);
  },
});
