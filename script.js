
// JavaScript - 'this
// Usually determined by how a function is called (What we call 'execution context')
// Can be determined useing four rules (global, object/implicit, explicit, new)

// ********************************************************************************************
// The 'new' keyword will create an object that when using 'this' in the context of that
// new object will refer to the parent object. Even if there is only the parent and no 
// child. This is not the case when utilizing 'this' in relation to objects created without 'new',
// in which case 'this' will refer to the global scope if utilizing 'this' within the parent. 
// ********************************************************************************************

// ***Every time a function is created it will acquire its own 'this'
// and its own 'arguments' keywords. ***

var example = "Global";
console.log(this); // global window object

window.onload = function() {

    function exampleFunction() {
        console.log(this); // 'this' currently refers to the global window object. (Not the function).
        console.log(this.example === example); // results in true.

        // ***Utilizing strict mode will prevent you from accessing / creating global variables***
        // Attempting to do so will result in a TypeError. It is considered a good practice
        // to utilize strict mode to prevent accidental use of any "bad" practices.
    }
    exampleFunction();

    var data = {};
    data.instructor = "Sam";

    // Results in undefined since instructor is declared inside of the data object.
    console.log(this.instructor); // Undefined

    // Assigning a property named instructor with the value of Blake to
    // the global window object.
    this.instructor = 'Blake';    

    // Now this.instructor will return Blake, since the global object now also has a property
    // of instructor.
    console.log(this.instructor); // Blake

    // However, the data object still contains it's own private property
    // instructor with the value of Sam.
    console.log(data.instructor); // Sam

    var person = {
        firstName: "Sam",
        sayHi: function() {
            // When utilizing 'this' inside of a child object, 'this' will refer to the object
            // immediately above the object using 'this'.
            // This is refered to as implicit binding.
            return "Hi " + this.firstName;
        },
        determineContext: function() {
            return this === person;
        }
    }
    console.log(person.sayHi()); // Hi Sam

    // Will result in true since 'this' is currently refering to the person object.
    console.log(person.determineContext()); // true

    var person2 = {
        firstName: "Sam",
        sayHi: function() {

            return "Hi " + this.firstName;
        },
        determineContext: function() {
            return this === person2;
        },
        dog: {
            sayHello: function() {
                // 'firstName' results in undefined since the higher order object is dog,
                // which doesn't contain that variable.
                return "Hello " + this.firstName;
            },
            determineContext: function() {
                // results in false since 'this' currently refers to the dog object.
                return this === person2;
            }
        }
    }
    console.log(person2.dog.sayHello()); // Hello undefined
    console.log(person2.dog.determineContext()); // false

    "use strict"

    // *************************************************************************************

    // You can explicitly bind this to another object to fix this.
    console.log(person2.dog.sayHello.call(person2)); // Hello Sam
    console.log(person2.dog.determineContext.call(person2)); // true
    // With the above call statement we are altering the scope to the parameter
    // passed in. Which gives sayHello and determineContext access to person2's 
    // property firstName, and also causing determineContext to return true.

    /* Explicit Binding

    Methods   Parameters                               Invoked Immediately
    -------   -------------------------------------    -------------------
    Call      obj.call(scopeToBindTo, a, b, c, ...);        YES
    Apply     obj.apply(scopeToBindTo, [a, b, c, ...]);     YES
    Bind      obj.bind(scopeToBindTo, a, b, c, ...);        NO
    */

    // Explicit Binding is a great practice to reduce code duplication
    var Sam = {
        firstName: "Sam",
        sayHi: function() {
            return "Hi " + this.firstName;
        }
    }

    var Blake = {
        firstName: "Blake"
    }

    console.log(Sam.sayHi()); // Hi Sam
    console.log(Sam.sayHi.call(Blake));// Hi Blake
    // We first utilize the Sam object and its property sayHi prior to binding to 
    // the Blake object so that we acquire the desired output of "Hi Blake". "Blake"
    // is acquired through the Blake object firstName property which is scoped to
    // by binding to the Blake object. 

    // Taking the above example one step further

    function sayHello() {
        return "Hello " + this.firstName;
    }

    console.log(sayHello.call(Sam)); // Hello Sam
    console.log(sayHello.call(Blake)); // Hello Blake

    // Taking yet another step

    function sumEvenArguments(){

        // Without using .call in this context the target of slice would be the newly 
        // created array. So by using .call we are altering the target of slice to 'arguments'
        var newArgs = [].slice.call(arguments);
        // Utilizing this as a means to solve the above isn't the only way to effectively
        // produce code that will provide that same result.

        return newArgs.reduce(function(acc,next){
            if(next % 2 === 0){
                return acc+next;
            }
            return acc;
        },0);
    }

    console.log(sumEvenArguments(1,2,3,4)); // 6
    console.log(sumEvenArguments(1,2,6)); // 8
    console.log(sumEvenArguments(1,2)); // 2

    // *************************************************************************************

    // the apply method works similar to the call method, however it differs when
    // passing additional arguments to the methods. Call will accept an infinite amount
    // of parameters where as apply will only accept two. One being the scope to bind to,
    // and an array of infinite values.

    function add(a,b){
        return a+b;
    }

    console.log(add.apply(this, [4, 7])); // 11
    // You can also utilize the arguments object that corresponds to the paramenters passed to
    // a function. Since, the arguments object is array-like.
    
    // More advanced use of apply.
    function invokeMax(fn, num){
    
        var count = 0;
        console.log("InvokeMax initialized.")
        console.log("count: " + count);
        
        return function() {
            if (count >= num) {
                return "Maxed Out!";
            }
            
            else {
                // On the declaration of addOnlyThreeTimes count is incremented.
                // But on the third execution of addOnlyThreeTimes count will not equal
                // three until the last iteration, thus allowing for a total of 4 executions
                // of invokeMax code. 
                count++;
                console.log("count: " + count);
                return fn.apply(this, arguments);
                // utilizing apply in this context isn't exactly necessary, since the code
                // will execute as expected.
            }
        }
    }
    var addOnlyThreeTimes = invokeMax(add, 3);
    // Sets up invokeMax and allows for the passing of parameters to add through the use of
    //addOnlyThreeTimes(a, b);

    console.log(addOnlyThreeTimes(1,4)); // 5
    console.log(addOnlyThreeTimes(2,7)); // 9
    console.log(addOnlyThreeTimes(1,3)); // 4
    console.log(addOnlyThreeTimes(1,2)); // "Maxed Out!"

    // *************************************************************************************

    // Bind - Works similar to call, however the code isn't executed immediately. It instead
    // returns a copy that can later be executed, and also have additional parameters passed
    // into it that would also be processed similar to the first parameters passed during
    // the declaration statement.

    function addNumbers(a, b, c, d) {
        return this.firstName + " calculated: " + (a+b+c+d);
    }

    var sumNumbers = addNumbers.bind(Sam, 1, 2); 
    console.log(sumNumbers()); // Sam calculated: NaN
    // NaN is the partial result of this function call due to the incomplete parameter list.
    // However, we can resolve this by adding the additional two parameters.
    console.log(sumNumbers(3, 4)); // Sam calculated: 10
    // ***This is referred to as "partial application"***

    // When utilizing 'this' within a setTimeout property function that is nested in an object, you
    // would expect 'this' to provide access to other properties inside of that object. However,
    // this is not initially the case. When setTimeout is used in conjunction with 'this', 'this'
    // will refer to the global scope of the application. You can circumvent this by utilizing bind.

    var timeOut = {
        firstName: "Sam",
        sayHi: function() {
            setTimeout(function() {
                console.log("Hi " + this.firstName);
            }, 1000);
        }
    }
    timeOut.sayHi(); // Hi undefined

    // To resolve the default binding of the TimeOut method, you must utilize .bind passing 'this'
    // as the only parameter to .bind.

    var timeOut2 = {
        firstName: "Sam",
        sayHi: function() {
            setTimeout(function() {
                console.log("Hi " + this.firstName);
            }.bind(this), 2000);
        }
    }
    timeOut2.sayHi(); // Hi Sam
}