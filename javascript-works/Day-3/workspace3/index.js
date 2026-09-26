let bechAge = 18;
let age = 15;

console.log(age > bechAge);

let isStudent = true;
let isMarried = false;
let isRaining = false;
let isLightOn = false;
// let numOne = 1;
// let numTwo = 5;
// let payment;
// let status = null;


//  console.log(numOne === numTwo);
//  console.log(payment)

//  let x = 8
//  let y = 5
//  let sum = 0;

//  sum += x 
//  sum -= y
//  console.log(sum);
//  let numOne = 10;
// let numTwo = 3;
// let sum = numOne + numTwo;
// let diff = numOne - numTwo;
// let mult = numOne * numTwo;
// let div = numOne / numTwo;
// let remainder = numOne % numTwo;
// let powerOf = numOne ** numTwo;
// console.log(sum, diff, mult, div, remainder, powerOf) // 7,1,12,1.33,1, 64
// console.log(4 < 5);
// console.log(5 > 4);
// console.log(4 <= 5);



// const check1 = 4 > 3 && 10 > 5         // true && true -> true
// const check2 = 4 > 3 && 10 < 5         // true && false -> false
// const check3 = 4 < 3 && 10 < 5         // false && false -> false

// let val = 6;
// let counter = ++val
// console.log(counter)
// console.log(val)

let val = 6
let counter;

counter = val++

console.log(val)
console.log(counter)
// Date object

let now = new Date ()
console.log(now)
console.log(now.getFullYear());
console.log(now.getTime());
console.log(now.getHours())
console.log(now.getDay() +1)
console.log(now.getMonth() +1);

// dd/ mm/yy : h:m:s

let yy = now.getFullYear()
let mm = now.getMonth() + 1
let day = now.getDay() + 1
let hrs = now.getHours()
let mins = now.getMinutes()
let secs = now.getSeconds()
let date = now.getDate()

console.log(`${date}/${mm}/${yy} : ${hrs}/${mins}/${secs}`)