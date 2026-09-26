
let firstName = "Olorunniyi";
let lastName = "oluwapelumi";
let country = "Nigeria";
let city = "Ibadan";
let age = 15;
let isMarried = false;
let year = 2026;
let gap = "15"

console.log(typeof firstName);
console.log(typeof lastName);
console.log(typeof country);
console.log(typeof city);
console.log(typeof age);
console.log(typeof isMarried);
console.log(typeof year);

console.log('10' == 10);
console.log(parseInt('9.8') == 10);

// false value

console.log("country" === city );
console.log(parseInt('9.8') == 10);

// truth value
console.log(age == gap);
console.log(4 > 3);
console.log(4 >= 3);
console.log(4 < 3);
console.log(4 <= 3);
console.log(4 == 4);
console.log(4 === 4);
console.log(4 != 4);
console.log(4 !== 4);
console.log(4 != '4');
console.log(4 == '4');
console.log(4 === '4');

let python = "python";
let jargon = "jargon";

console.log(python.length);
console.log(jargon.length);

console.log(python == jargon);
console.log(4 > 3 && 10 < 12);
console.log(4 > 3 && 10 > 12);
console.log(4 > 3 || 10 < 12);
console.log(4 > 3 || 10 > 124);
console.log(!(4 > 3));
console.log(!(4 < 3));
console.log(!(false));
console.log(!(4 > 3 && 10 < 12));
console.log(!(4 > 3 && 10 > 12));
console.log(!(4 === '4'));
console.log(!("dragon".includes("on") && "python".includes("on")));

// EXERCISE 2

let base = prompt("Enter your base");
let height = prompt("Enter your height");

let area = 0.5 * base * height;
console.log(`The area of the trriangle is ${area}`);