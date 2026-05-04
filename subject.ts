import { of } from "./creational-operators.js";
import { Observable, type Observer, type Subscription } from "./observable.js";

class Subject<T> extends Observable<T> implements Observer<T> {
  private observers: Observer<T>[] = [];

  override subscribe(observer: Observer<T>): Subscription {
    if (!this.observers.find((value) => value === observer)) {
      this.observers.push(observer);
    }
    return {
      unsubscribe: () => {
        this.observers = this.observers.filter((ob) => ob !== observer);
      },
    };
  }
  //observer part
  next(value: T) {
    //broadcast  this value to all your observers
    this.observers.forEach((ob) => ob.next(value));
  }
  //implement error and complete methods as well
}

const aSubject$= new Subject<number>();

aSubject$.next(10);// here zero observer so this value is not emitted

const observer1: Observer<number> = {
  next(value) {
    console.log("Observer1 recieved: ", value);
  },
};
const observer2: Observer<number> = {
  next(value) {
    console.log("Observer2 recieved: ", value);
  },
};

aSubject$.subscribe(observer1);
//aSubject.subscribe(observer2);
const observer2Subscription=aSubject$.subscribe(observer2)
aSubject$.next(1);
//observer2Subscription.unsubscribe();

aSubject$.next(2);


of(1,2,3,4,5,6).subscribe(aSubject$)