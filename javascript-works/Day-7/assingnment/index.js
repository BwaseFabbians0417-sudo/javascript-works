
// 30 DAYS OF JAVASCRIPT - DAY 7
// FUNCTIONS


// LEVEL 1

// 1. fullName
function fullName() {
  console.log("Oluwapelumi Olorunniyi");
}

fullName();


// 2. fullName with parameters
function fullNameWithParameters(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

console.log(fullNameWithParameters("Oluwapelumi", "Olorunniyi"));


// 3. addNumbers
function addNumbers(a, b) {
  return a + b;
}

console.log(addNumbers(5, 10));


// 4. areaOfRectangle
function areaOfRectangle(length, width) {
  return length * width;
}

console.log(areaOfRectangle(10, 5));


// 5. perimeterOfRectangle
function perimeterOfRectangle(length, width) {
  return 2 * (length + width);
}

console.log(perimeterOfRectangle(10, 5));


// 6. volumeOfRectPrism
function volumeOfRectPrism(length, width, height) {
  return length * width * height;
}

console.log(volumeOfRectPrism(10, 5, 4));


// 7. areaOfCircle
function areaOfCircle(r) {
  return Math.PI * r * r;
}

console.log(areaOfCircle(5));


// 8. circumOfCircle
function circumOfCircle(r) {
  return 2 * Math.PI * r;
}

console.log(circumOfCircle(5));


// 9. density
function density(mass, volume) {
  return mass / volume;
}

console.log(density(100, 20));


// 10. speed
function speed(distance, time) {
  return distance / time;
}

console.log(speed(100, 2));


// 11. weight
function weight(mass, gravity) {
  return mass * gravity;
}

console.log(weight(50, 9.8));


// 12. convertCelsiusToFahrenheit
function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

console.log(convertCelsiusToFahrenheit(25));


// 13. BMI
function bmi(weight, height) {
  const result = weight / (height * height);

  if (result < 18.5) {
    return `BMI: ${result.toFixed(2)} - Underweight`;
  } else if (result <= 24.9) {
    return `BMI: ${result.toFixed(2)} - Normal weight`;
  } else if (result <= 29.9) {
    return `BMI: ${result.toFixed(2)} - Overweight`;
  } else {
    return `BMI: ${result.toFixed(2)} - Obese`;
  }
}

console.log(bmi(70, 1.75));


// 14. checkSeason
function checkSeason(month) {
  month = month.toLowerCase();

  if (
    month === "september" ||
    month === "october" ||
    month === "november"
  ) {
    return "Autumn";
  } else if (
    month === "december" ||
    month === "january" ||
    month === "february"
  ) {
    return "Winter";
  } else if (
    month === "march" ||
    month === "april" ||
    month === "may"
  ) {
    return "Spring";
  } else if (
    month === "june" ||
    month === "july" ||
    month === "august"
  ) {
    return "Summer";
  } else {
    return "Invalid month";
  }
}

console.log(checkSeason("January"));


// 15. findMax without Math.max
function findMax(a, b, c) {
  let max = a;

  if (b > max) {
    max = b;
  }

  if (c > max) {
    max = c;
  }

  return max;
}

console.log(findMax(0, 10, 5));
console.log(findMax(0, -10, -2));



// ==========================================
// LEVEL 2
// ==========================================

// 1. solveLinEquation
// ax + by + c = 0
function solveLinEquation(a, b, c) {
  if (b === 0) {
    return "Cannot solve for y when b is 0.";
  }

  return `y = ${(-a)}x + ${(-c / b)}`;
}

console.log(solveLinEquation(2, 3, 6));


// 2. solveQuadEquation
function solveQuadratic(a = 0, b = 0, c = 0) {
  if (a === 0 && b === 0 && c === 0) {
    return 0;
  }

  if (a === 0) {
    return -c / b;
  }

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return "No real roots";
  }

  if (discriminant === 0) {
    return -b / (2 * a);
  }

  const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

  return [root1, root2];
}

console.log(solveQuadratic());
console.log(solveQuadratic(1, 4, 4));
console.log(solveQuadratic(1, -1, -2));
console.log(solveQuadratic(1, 7, 12));
console.log(solveQuadratic(1, 0, -4));
console.log(solveQuadratic(1, -1, 0));


// 3. printArray
function printArray(array) {
  for (const item of array) {
    console.log(item);
  }
}

printArray([1, 2, 3, 4, 5]);


// 4. showDateTime
function showDateTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  console.log(`${day}/${month}/${year} ${hours}:${minutes}`);
}

showDateTime();


// 5. swapValues
function swapValues(x, y) {
  return [y, x];
}

console.log(swapValues(3, 4));
console.log(swapValues(4, 5));


// 6. reverseArray without reverse()
function reverseArray(array) {
  const reversed = [];

  for (let i = array.length - 1; i >= 0; i--) {
    reversed.push(array[i]);
  }

  return reversed;
}

console.log(reverseArray([1, 2, 3, 4, 5]));
console.log(reverseArray(["A", "B", "C"]));


// 7. capitalizeArray
function capitalizeArray(array) {
  const result = [];

  for (const item of array) {
    result.push(item.toUpperCase());
  }

  return result;
}

console.log(capitalizeArray(["apple", "banana", "orange"]));


// 8. addItem
let items = [];

function addItem(item) {
  items.push(item);
  return items;
}

console.log(addItem("Apple"));
console.log(addItem("Banana"));


// 9. removeItem
function removeItem(index) {
  items.splice(index, 1);
  return items;
}

console.log(removeItem(0));


// 10. sumOfNumbers
function sumOfNumbers(n) {
  let sum = 0;

  for (let i = 0; i <= n; i++) {
    sum += i;
  }

  return sum;
}

console.log(sumOfNumbers(10));


// 11. sumOfOdds
function sumOfOdds(n) {
  let sum = 0;

  for (let i = 0; i <= n; i++) {
    if (i % 2 !== 0) {
      sum += i;
    }
  }

  return sum;
}

console.log(sumOfOdds(10));


// 12. sumOfEven
function sumOfEven(n) {
  let sum = 0;

  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0) {
      sum += i;
    }
  }

  return sum;
}

console.log(sumOfEven(10));


// 13. evensAndOdds
function evensAndOdds(n) {
  let evens = 0;
  let odds = 0;

  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0) {
      evens++;
    } else {
      odds++;
    }
  }

  console.log(`The number of odds are ${odds}.`);
  console.log(`The number of evens are ${evens}.`);
}

evensAndOdds(100);


// 14. sum of any number of arguments
function sum(...numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  return total;
}

console.log(sum(1, 2, 3));
console.log(sum(1, 2, 3, 4));


// 15. randomUserIp
function randomUserIp() {
  const ip = [];

  for (let i = 0; i < 4; i++) {
    ip.push(Math.floor(Math.random() * 256));
  }

  return ip.join(".");
}

console.log(randomUserIp());


// 16. randomMacAddress
function randomMacAddress() {
  const characters = "0123456789ABCDEF";
  const mac = [];

  for (let i = 0; i < 6; i++) {
    let pair = "";

    for (let j = 0; j < 2; j++) {
      pair += characters[Math.floor(Math.random() * characters.length)];
    }

    mac.push(pair);
  }

  return mac.join(":");
}

console.log(randomMacAddress());


// 17. randomHexaNumberGenerator
function randomHexaNumberGenerator() {
  const characters = "0123456789abcdef";
  let hex = "#";

  for (let i = 0; i < 6; i++) {
    hex += characters[Math.floor(Math.random() * characters.length)];
  }

  return hex;
}

console.log(randomHexaNumberGenerator());


// 18. userIdGenerator
function userIdGenerator() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let id = "";

  for (let i = 0; i < 7; i++) {
    id += characters[Math.floor(Math.random() * characters.length)];
  }

  return id;
}

console.log(userIdGenerator());




// LEVEL 3


// 1. userIdGeneratedByUser
function userIdGeneratedByUser() {
  const numberOfCharacters = Number(
    prompt("Enter number of characters:")
  );

  const numberOfIds = Number(
    prompt("Enter number of IDs:")
  );

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const ids = [];

  for (let i = 0; i < numberOfIds; i++) {
    let id = "";

    for (let j = 0; j < numberOfCharacters; j++) {
      id += characters[Math.floor(Math.random() * characters.length)];
    }

    ids.push(id);
  }

  return ids.join("\n");
}

console.log(userIdGeneratedByUser());


// 2. rgbColorGenerator
function rgbColorGenerator() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
}

console.log(rgbColorGenerator());


// 3. arrayOfHexaColors
function arrayOfHexaColors(number) {
  const colors = [];

  for (let i = 0; i < number; i++) {
    colors.push(randomHexaNumberGenerator());
  }

  return colors;
}

console.log(arrayOfHexaColors(3));


// 4. arrayOfRgbColors
function arrayOfRgbColors(number) {
  const colors = [];

  for (let i = 0; i < number; i++) {
    colors.push(rgbColorGenerator());
  }

  return colors;
}

console.log(arrayOfRgbColors(3));


// 5. convertHexaToRgb
function convertHexaToRgb(hex) {
  hex = hex.replace("#", "");

  if (hex.length !== 6) {
    return "Invalid hexadecimal color";
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgb(${r},${g},${b})`;
}

console.log(convertHexaToRgb("#ff0000"));


// 6. convertRgbToHexa
function convertRgbToHexa(r, g, b) {
  const toHex = value => {
    return value.toString(16).padStart(2, "0");
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

console.log(convertRgbToHexa(255, 0, 0));


// 7. generateColors
function generateColors(type, number) {
  const colors = [];

  for (let i = 0; i < number; i++) {
    if (type.toLowerCase() === "hexa") {
      colors.push(randomHexaNumberGenerator());
    } else if (type.toLowerCase() === "rgb") {
      colors.push(rgbColorGenerator());
    } else {
      return "Invalid color type";
    }
  }

  return number === 1 ? colors[0] : colors;
}

console.log(generateColors("hexa", 3));
console.log(generateColors("hexa", 1));
console.log(generateColors("rgb", 3));
console.log(generateColors("rgb", 1));


// 8. shuffleArray
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] =
      [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

console.log(shuffleArray([1, 2, 3, 4, 5]));


// 9. factorial
function factorial(n) {
  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

console.log(factorial(5));


// 10. isEmpty
function isEmpty(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  ) {
    return true;
  }

  return false;
}

console.log(isEmpty(""));
console.log(isEmpty([]));
console.log(isEmpty("Hello"));


// 11. sum
function sumArguments(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

console.log(sumArguments(1, 2, 3));
console.log(sumArguments(1, 2, 3, 4));


// 12. sumOfArrayItems
function sumOfArrayItems(array) {
  if (!array.every(item => typeof item === "number")) {
    return "All items must be numbers.";
  }

  return array.reduce((sum, item) => sum + item, 0);
}

console.log(sumOfArrayItems([1, 2, 3, 4, 5]));
console.log(sumOfArrayItems([1, 2, "3", 4]));


// 13. average
function average(array) {
  if (!array.every(item => typeof item === "number")) {
    return "All items must be numbers.";
  }

  if (array.length === 0) {
    return "Array cannot be empty.";
  }

  const total = array.reduce((sum, item) => sum + item, 0);

  return total / array.length;
}

console.log(average([10, 20, 30, 40, 50]));


// 14. modifyArray
function modifyArray(array) {
  if (array.length < 5) {
    return "Not Found";
  }

  const modifiedArray = [...array];

  modifiedArray[4] = String(modifiedArray[4]).toUpperCase();

  return modifiedArray;
}

console.log(
  modifyArray([
    "Avocado",
    "Tomato",
    "Potato",
    "Mango",
    "Lemon",
    "Carrot"
  ])
);

console.log(
  modifyArray([
    "Google",
    "Facebook",
    "Apple",
    "Amazon",
    "Microsoft",
    "IBM"
  ])
);

console.log(
  modifyArray([
    "Google",
    "Facebook",
    "Apple",
    "Amazon"
  ])
);


// 15. isPrime
function isPrime(number) {
  if (number < 2) {
    return false;
  }

  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
}

console.log(isPrime(7));
console.log(isPrime(10));


// 16. Check if all items are unique
function areItemsUnique(array) {
  return new Set(array).size === array.length;
}

console.log(areItemsUnique([1, 2, 3, 4]));
console.log(areItemsUnique([1, 2, 2, 4]));


// 17. Check if all items have same data type
function areSameDataType(array) {
  if (array.length === 0) {
    return true;
  }

  const firstType = typeof array[0];

  return array.every(item => typeof item === firstType);
}

console.log(areSameDataType([1, 2, 3, 4]));
console.log(areSameDataType([1, "2", 3]));


// 18. isValidVariable
function isValidVariable(variable) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(variable);
}

console.log(isValidVariable("firstName"));
console.log(isValidVariable("first-name"));
console.log(isValidVariable("_firstName"));
console.log(isValidVariable("$firstName"));
console.log(isValidVariable("123name"));


// 19. sevenRandomNumbers
function sevenRandomNumbers() {
  const numbers = [];

  while (numbers.length < 7) {
    const number = Math.floor(Math.random() * 10);

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
}

console.log(sevenRandomNumbers());


// 20. reverseCountries
function reverseCountries(countries) {
  const copiedCountries = [...countries];

  const reversed = [];

  for (let i = copiedCountries.length - 1; i >= 0; i--) {
    reversed.push(copiedCountries[i]);
  }

  return reversed;
}

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Egypt"
];

console.log(reverseCountries(countries));
console.log(countries);