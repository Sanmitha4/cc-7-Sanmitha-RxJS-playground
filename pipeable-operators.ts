// TODO:
// TODO:
//An operator is a function that takes an observable and returns an observable

import { of } from "./creational-operators.js";
import { Observable } from "./observable.js";

type Operator<T,U>=(input$:Observable<T>)=>Observable<U>;

//lets implement an operator 'double'

const double:Operator<number,number>=(input$ :Observable<number>):Observable<number>{
    //create the output observable .Its executor function
    //must read values of input and double them and feed them to the observer of output observable.
    //yout get a reference to it in the executor function

    const output$=new Observable<T>((observer)=>{
        const inputSubscription=input$.subscribe({
            next(value){
                if(value!=undefined){
                    observer.next(value*2);

                }
            }
        })
        return ()=>{
            inputSubscription.unsubscribe();
        }
    })
    return output$;

}

const square :Operator<number,number>=(input$:Observable<number>):Observable<number>{
    const output$=new Observable<T>((observer)=>{
        const inputSubscription=input$.subscribe({
            next(value) {
                if (value!=undefined){
                    observer.next(value*value);
                }
            },
        })
        return()=>{
            inputSubscription.unsubscribe()
        }

    })
    return output$;

}



const first:Operator<unknown,unknown>=(
    input$:Observable<unknown>,):Observable<unknown>=>{
        //we should subscribe to tnput,read very first value ,and pass it
        // to the observer of the output observable and immediately  unsubscribe from input $
        const output$=new Observable<T>((observer)=>{
            const subscription=input$.subscribe({
                next(value:unknown){
                    observer.next(value);
                //sooon after we consume the first value of input  we need to unsubscribe
                    subscription.unsubscribe();

            },
        })<
            return null;
        })
        return output$;

    }
//we can actually chain these-compose or pipe 
//we can craete an observable that doubles and then squares a given observable,


const anObservable$=of(1,2,3,4,5);

const firstSquare$=first(square(double(anObservable$)))

