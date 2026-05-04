import { of } from "./creational-operators.js";
import type { Observer } from "./observable.js";
import { Subject } from "./subject.js";

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