
// DAY 6 - LOOPS

// ARRAYS

const countries = [
  'Albania',
  'Bolivia',
  'Canada',
  'Denmark',
  'Ethiopia',
  'Finland',
  'Germany',
  'Hungary',
  'Ireland',
  'Japan',
  'Kenya'
];

const webTechs = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB'
];

const mernStack = ['MongoDB', 'Express', 'React', 'Node'];


// ==========================================
// LEVEL 1
// ==========================================

// 1. Iterate 0 to 10 using for, while and do while

console.log('1. FOR LOOP');

for (let i = 0; i <= 10; i++) {
  console.log(i);
}

console.log('WHILE LOOP');

let i = 0;

while (i <= 10) {
  console.log(i);
  i++;
}

console.log('DO WHILE LOOP');

let j = 0;

do {
  console.log(j);
  j++;
} while (j <= 10);


// 2. Iterate 10 to 0 using for, while and do while

console.log('2. FOR LOOP');

for (let i = 10; i >= 0; i--) {
  console.log(i);
}

console.log('WHILE LOOP');

let k = 10;

while (k >= 0) {
  console.log(k);
  k--;
}

console.log('DO WHILE LOOP');

let l = 10;

do {
  console.log(l);
  l--;
} while (l >= 0);


// 3. Iterate 0 to n

let n = 10;

for (let i = 0; i <= n; i++) {
  console.log(i);
}


// 4. Print # pattern

let pattern = '';

for (let i = 0; i < 7; i++) {
  pattern += '#';
  console.log(pattern);
}


// 5. Multiplication pattern

for (let i = 0; i <= 10; i++) {
  console.log(`${i} x ${i} = ${i * i}`);
}


// 6. Print i, i² and i³

console.log('i    i^2    i^3');

for (let i = 0; i <= 10; i++) {
  console.log(`${i}    ${i ** 2}    ${i ** 3}`);
}


// 7. Print even numbers from 0 to 100

console.log('Even numbers:');

for (let i = 0; i <= 100; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}


// 8. Print odd numbers from 0 to 100

console.log('Odd numbers:');

for (let i = 0; i <= 100; i++) {
  if (i % 2 !== 0) {
    console.log(i);
  }
}


// 9. Print prime numbers from 0 to 100

console.log('Prime numbers:');

for (let i = 2; i <= 100; i++) {
  let isPrime = true;

  for (let j = 2; j < i; j++) {
    if (i % j === 0) {
      isPrime = false;
      break;
    }
  }

  if (isPrime) {
    console.log(i);
  }
}


// 10. Sum of all numbers from 0 to 100

let sum = 0;

for (let i = 0; i <= 100; i++) {
  sum += i;
}

console.log(`The sum of all numbers from 0 to 100 is ${sum}.`);


// 11. Sum of evens and odds

let evenSum = 0;
let oddSum = 0;

for (let i = 0; i <= 100; i++) {
  if (i % 2 === 0) {
    evenSum += i;
  } else {
    oddSum += i;
  }
}

console.log(`The sum of all evens from 0 to 100 is ${evenSum}.`);
console.log(`The sum of all odds from 0 to 100 is ${oddSum}.`);


// 12. Sum of evens and odds as array

console.log([evenSum, oddSum]);


// 13. Generate an array of 5 random numbers

let randomNumbers = [];

for (let i = 0; i < 5; i++) {
  randomNumbers.push(Math.floor(Math.random() * 100));
}

console.log(randomNumbers);


// 14. Generate 5 unique random numbers

let uniqueNumbers = [];

while (uniqueNumbers.length < 5) {
  let number = Math.floor(Math.random() * 100);

  if (!uniqueNumbers.includes(number)) {
    uniqueNumbers.push(number);
  }
}

console.log(uniqueNumbers);


// 15. Generate a six-character random ID

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let randomId = '';

for (let i = 0; i < 6; i++) {
  randomId += characters[Math.floor(Math.random() * characters.length)];
}

console.log(randomId);



// LEVEL 2


// 1. Generate random ID of any number of characters

let idLength = 12;
let randomId2 = '';

for (let i = 0; i < idLength; i++) {
  randomId2 += characters[Math.floor(Math.random() * characters.length)];
}

console.log(randomId2);


// 2. Generate random hexadecimal number

const hexCharacters = '0123456789abcdef';

let randomHex = '#';

for (let i = 0; i < 6; i++) {
  randomHex +=
    hexCharacters[Math.floor(Math.random() * hexCharacters.length)];
}

console.log(randomHex);


// 3. Generate random RGB color

let r = Math.floor(Math.random() * 256);
let g = Math.floor(Math.random() * 256);
let b = Math.floor(Math.random() * 256);

console.log(`rgb(${r},${g},${b})`);


// 4. Countries in uppercase

let upperCountries = [];

for (const country of countries) {
  upperCountries.push(country.toUpperCase());
}

console.log(upperCountries);


// 5. Countries length

let countryLengths = [];

for (const country of countries) {
  countryLengths.push(country.length);
}

console.log(countryLengths);


// 6. Countries with country code and length

const countryCodes = [
  'ALB',
  'BOL',
  'CAN',
  'DEN',
  'ETH',
  'FIN',
  'GER',
  'HUN',
  'IRE',
  'JAP',
  'KEN'
];

let countryInformation = [];

for (let i = 0; i < countries.length; i++) {
  countryInformation.push([
    countries[i],
    countryCodes[i],
    countries[i].length
  ]);
}

console.log(countryInformation);


// 7. Countries containing "land"

let landCountries = [];

for (const country of countries) {
  if (country.includes('land')) {
    landCountries.push(country);
  }
}

if (landCountries.length > 0) {
  console.log(landCountries);
} else {
  console.log('All these countries are without land');
}


// 8. Countries ending with "ia"

let iaCountries = [];

for (const country of countries) {
  if (country.endsWith('ia')) {
    iaCountries.push(country);
  }
}

if (iaCountries.length > 0) {
  console.log(iaCountries);
} else {
  console.log('These are countries ends without ia');
}


// 9. Country containing the biggest number of characters

let longestCountry = countries[0];

for (const country of countries) {
  if (country.length > longestCountry.length) {
    longestCountry = country;
  }
}

console.log(longestCountry);


// 10. Countries containing only 5 characters

let fiveLetterCountries = [];

for (const country of countries) {
  if (country.length === 5) {
    fiveLetterCountries.push(country);
  }
}

console.log(fiveLetterCountries);


// 11. Longest word in webTechs

let longestTech = webTechs[0];

for (const tech of webTechs) {
  if (tech.length > longestTech.length) {
    longestTech = tech;
  }
}

console.log(longestTech);


// 12. webTechs with their lengths

let webTechInformation = [];

for (const tech of webTechs) {
  webTechInformation.push([tech, tech.length]);
}

console.log(webTechInformation);


// 13. Create MERN acronym

let mern = '';

for (const tech of mernStack) {
  mern += tech[0];
}

console.log(mern);


// 14. Iterate through technologies

const technologies = [
  'HTML',
  'CSS',
  'JS',
  'React',
  'Redux',
  'Node',
  'Express',
  'MongoDB'
];

for (const technology of technologies) {
  console.log(technology);
}


// 15. Reverse fruit array without reverse()

const fruits = ['banana', 'orange', 'mango', 'lemon'];

let reversedFruits = [];

for (let i = fruits.length - 1; i >= 0; i--) {
  reversedFruits.push(fruits[i]);
}

console.log(reversedFruits);


// 16. Print fullStack elements

const fullStack = [
  ['HTML', 'CSS', 'JS', 'React'],
  ['Node', 'Express', 'MongoDB']
];

for (const stack of fullStack) {
  for (const technology of stack) {
    console.log(technology.toUpperCase());
  }
}


// ==========================================
// LEVEL 3
// ==========================================

// 1. Copy countries array without mutation

const copiedCountries = [...countries];

console.log(copiedCountries);


// 2. Copy and sort countries

const sortedCountries = [...countries];

sortedCountries.sort();

console.log(sortedCountries);


// 3. Sort webTechs and mernStack

const sortedWebTechs = [...webTechs].sort();
const sortedMernStack = [...mernStack].sort();

console.log(sortedWebTechs);
console.log(sortedMernStack);


// 4. Extract countries containing "land"

const countriesWithLand = countries.filter(country =>
  country.includes('land')
);

console.log(countriesWithLand);


// 5. Find country with highest number of characters

let highestCharacterCountry = countries[0];

for (const country of countries) {
  if (country.length > highestCharacterCountry.length) {
    highestCharacterCountry = country;
  }
}

console.log(highestCharacterCountry);


// 6. Extract countries containing "land"

const landCountriesAgain = countries.filter(country =>
  country.includes('land')
);

console.log(landCountriesAgain);


// 7. Countries containing only four characters

const fourLetterCountries = countries.filter(country =>
  country.length === 4
);

console.log(fourLetterCountries);


// 8. Countries containing two or more words

const multiWordCountries = countries.filter(country =>
  country.split(' ').length >= 2
);

console.log(multiWordCountries);


// 9. Reverse countries and capitalize each country

const reversedCountries = [...countries]
  .reverse()
  .map(country => country.toUpperCase());

console.log(reversedCountries);

