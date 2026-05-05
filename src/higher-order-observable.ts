import {
  concatAll,
  concatMap,
  from,
  interval,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from "rxjs";
const numberObservables$ = of(1, 2, 3, 4, 5); //emits numbers so t is a normal observable

// const numberHOObservables$=of(of(1,2,3),of(4,5)) //emits numbers so t is a normal observable
const numberHOObservables$ = of(of(1), of(2), of(3), of(4), of(5));

numberHOObservables$.subscribe((value) => {
  //value is an oservable to get the actual number it emits we need to subscribe to it and extract that value
  value.subscribe((innerValue) => console.log(innerValue));
});

//can we create a higher order observable using pipe and a map an numberObservable
//for each value we will transform it into a observable that emits that number

//of(of(1),of(2),of(3),0f(4),of(5))

const numberHOObservablesUsingPipe$ = numberHOObservables$.pipe(
  map((value) => of(value)),
);

const numbers = [1, 2, 3, 4];
// const transformed=numbers.map((value)=>[value]) //[[1],[2],[3],[4]]

// const transformed=numbers.map((value)=>[value]).flat() //[1,2,3,4]
const transformed = numbers.flatMap((value) => [value]); //[1,2,3,4]

//let's see few of join operators that help flatten a map that was producing a higher order observables.
// const numberHOObservablesUsingPipe1$=numberObservables$.pipe(
//     map((value)=>of(value)),//this operator produces an observable that produces observable as values
//     concatAll(),
// ).subscribe(v=>{
//     console.log('Value  rad after concatAll:-',v)
// })

const numberHOObservablesUsingPipe1$ = numberObservables$
  .pipe(
    map((value) => of(value)), //this operator produces an observable that produces observable as values
    tap((previousObs) => {
      console.log("Observable:", previousObs);
      console.log("Values after concat all:");
      return previousObs;
    }),

    concatAll(),
  )
  .subscribe((v) => {
    console.log("Value  after concatAll:-", v);
  });

//Never should a transform(map) should be done inside a tap,beacuse tap is a side effect
//   const numberHOObservablesUsingPipe1$ = numberObservables$
//   .pipe(
//     tap((value)=>{

//         return of(10,20,30);//ignored so use map
//     })
//     map((value) => of(value)), //this operator produces an observable that produces observable as values
//     tap((previousObs) => {
//         console.log('Observable:',previousObs)
//       console.log("Values after concat all:");
//       return previousObs;
//     }),

//     concatAll(),
//   )
//   .subscribe((v) => {
//     console.log("Value  after concatAll:-", v);
//   });

//when it is infinite
//take will give you a new observable which is finite-in this case something similar to:of(1,2,3)

// const numberHOObservables1$=of(interval(1000).pipe(take(3)),of(2),of(3),of(4),of(5));
// numberHOObservables1$.pipe(concatAll()).subscribe((value)=>console.log(value));

// of(111,222).pipe(take(5)).subscribe((value)=>console.log(value));

// if input$ produces less value and completes take  handles it gracefully

//concatAll operator is sequential process first>process second>
//there is mereAll,that does subscribe to all incoming observable and then emits  value as they arrive

console.log("Merge All");
numberHOObservables$
  .pipe(
    //map((value) => of(value)), //this operator produces an observable that produces observable as values
    mergeAll(),
  )
  .subscribe((v) => {
    console.log("Value  after concatAll:-", v);
    //you will observe the interval observable values will appear at the end.You will see the values emitted by non interval observables
    // appearing first .This is due to concurrent nature of mergeAll.Ypu will use merge when you don't care about the order i which the values a
    //are arriving.
  });

//Doing a map to produce a higher order observable and then using concatAll or mergeAll is extra work .
//Just like in functional programming we have flatMap()=flat()+Map() and concatMap,mergeMap

console.log("conact Map All");
//concatMap is factory,in callback it must return an observable value
const numberObservable1$ = from([10, 11, 12, 13, 14]);
const numberHOObservablesUsingPipe2$ = numberObservable1$
  .pipe(concatMap((value) => of(value)))
  .subscribe((v) => {
    console.log("Value  Concat MAP:-", v);
  });

console.log("MergeMap ");
//const numberObservable1$=from([10,11,12,13,14])
//this  is factory function,in callback it must return an observable value
const numberHOObservablesUsingPipe3$ = numberObservable1$
  .pipe(mergeMap((value) => of(value)))
  .subscribe((v) => {
    console.log("Value Merge MAP:-", v);
  });

//This operator will be consuming values which are observables and it starts producing values from current observable but immediately
//unsubscribes from it,should it see the next Observable value arrive from its input.
console.log("SwitchMap ");
//const numberObservable1$=from([10,11,12,13,14])
const numberHOObservablesUsingPipe4$ = numberObservable1$
  .pipe(switchMap((value) => of(value)))
  .subscribe((v) => {
    console.log("Value Switch MAP:-", v);
  });
