import { countries } from "./countries.js";
import { webTechs } from "./web_techs.js";


// 1. Declare an empty array
const emptyArray = [];
console.log("Empty array:", emptyArray);

// 2. Declare an array with more than five numbers
const numberArray = [4, 8, 15, 16, 23, 42, 50];

// 3. Find the array length
console.log("Number array length:", numberArray.length);

// 4. Get the first, middle, and last items
console.log("First item:", numberArray[0]);
console.log("Middle item:", numberArray[Math.floor(numberArray.length / 2)]);
console.log("Last item:", numberArray[numberArray.length - 1]);

// 5. Declare mixedDataTypes and find its length
const mixedDataTypes = ["hello", 42, true, null, { language: "JavaScript" }, [1, 2]];
console.log("Mixed data types length:", mixedDataTypes.length);

// 6. Declare itCompanies
const itCompanies = [
  "Facebook",
  "Google",
  "Microsoft",
  "Apple",
  "IBM",
  "Oracle",
  "Amazon"
];

// 7. Print the array
console.log("IT companies:", itCompanies);

// 8. Print the number of companies
console.log("Number of companies:", itCompanies.length);

// 9. Print the first, middle, and last company
console.log("First company:", itCompanies[0]);
console.log("Middle company:", itCompanies[Math.floor(itCompanies.length / 2)]);
console.log("Last company:", itCompanies[itCompanies.length - 1]);

// 10. Print each company
console.log("Each company:");
for (const company of itCompanies) {
  console.log(company);
}

// 11. Print each company in uppercase
console.log("Companies in uppercase:");
for (const company of itCompanies) {
  console.log(company.toUpperCase());
}

// 12. Print the array as a sentence
console.log(`${itCompanies.join(", ")} are big IT companies.`);

// 13. Check whether a company exists
const companyToFind = "Microsoft";
if (itCompanies.includes(companyToFind)) {
  console.log(companyToFind);
} else {
  console.log("Company not found");
}

// 14. Find companies with more than one "o", without using filter()
const companiesWithMultipleOs = [];

for (const company of itCompanies) {
  const numberOfOs = (company.toLowerCase().match(/o/g) || []).length;

  if (numberOfOs > 1) {
    companiesWithMultipleOs.push(company);
  }
}

console.log("Companies with more than one 'o':", companiesWithMultipleOs);

// 15. Sort the companies
console.log("Sorted companies:", [...itCompanies].sort());

// 16. Reverse the companies
console.log("Reversed companies:", [...itCompanies].reverse());

// 17. Slice out the first three companies
console.log("First three:", itCompanies.slice(0, 3));

// 18. Slice out the last three companies
console.log("Last three:", itCompanies.slice(-3));

// 19. Slice out the middle company or companies
const middleStart = Math.floor((itCompanies.length - 1) / 2);
const middleEnd = Math.floor(itCompanies.length / 2) + 1;
console.log("Middle company or companies:", itCompanies.slice(middleStart, middleEnd));

// 20. Remove the first company (from a copy)
const withoutFirstCompany = [...itCompanies];
withoutFirstCompany.shift();
console.log("Without the first company:", withoutFirstCompany);

// 21. Remove the middle company or companies (from a copy)
const withoutMiddleCompanies = [...itCompanies];
const middleIndex = Math.floor(withoutMiddleCompanies.length / 2);

if (withoutMiddleCompanies.length % 2 === 0) {
  withoutMiddleCompanies.splice(middleIndex - 1, 2);
} else {
  withoutMiddleCompanies.splice(middleIndex, 1);
}

console.log("Without the middle company or companies:", withoutMiddleCompanies);

// 22. Remove the last company (from a copy)
const withoutLastCompany = [...itCompanies];
withoutLastCompany.pop();
console.log("Without the last company:", withoutLastCompany);

// 23. Remove all companies (from a copy)
const noCompanies = [...itCompanies];
noCompanies.length = 0;
console.log("No companies:", noCompanies);


//LEVEL 2 

// 1. Remove punctuation, split into words, and count them
const text =
  "I love teaching and empowering people. I teach HTML, CSS, JS, React, Python.";

const words = text
  .replace(/[.,]/g, "")
  .split(/\s+/);

console.log("Words:", words);
console.log("Word count:", words.length);

// 2. Add, remove, and edit shopping-cart items
const shoppingCart = ["Milk", "Coffee", "Tea", "Honey"];

if (!shoppingCart.includes("Meat")) {
  shoppingCart.unshift("Meat");
}

if (!shoppingCart.includes("Sugar")) {
  shoppingCart.push("Sugar");
}

// Set this to true if you are allergic to honey.
const allergicToHoney = true;

if (allergicToHoney) {
  const honeyIndex = shoppingCart.indexOf("Honey");
  if (honeyIndex !== -1) {
    shoppingCart.splice(honeyIndex, 1);
  }
}

const teaIndex = shoppingCart.indexOf("Tea");
if (teaIndex !== -1) {
  shoppingCart[teaIndex] = "Green Tea";
}

console.log("Updated shopping cart:", shoppingCart);

// 3. Check whether Ethiopia is in the countries array
if (countries.includes("Ethiopia")) {
  console.log("ETHIOPIA");
} else {
  countries.push("Ethiopia");
  console.log("Updated countries:", countries);
}

// 4. Check whether Sass is in the webTechs array
if (webTechs.includes("Sass")) {
  console.log("Sass is a CSS preprocess");
} else {
  webTechs.push("Sass");
  console.log("Updated webTechs:", webTechs);
}

// 5. Concatenate front-end and back-end technologies
const frontEnd = ["HTML", "CSS", "JS", "React", "Redux"];
const backEnd = ["Node", "Express", "MongoDB"];
const fullStack = frontEnd.concat(backEnd);

console.log("Full stack:", fullStack);


// ==================== LEVEL 3 ====================

// 1. Sort ages and find the minimum and maximum
const ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24];
const sortedAges = [...ages].sort((a, b) => a - b);
const minAge = sortedAges[0];
const maxAge = sortedAges[sortedAges.length - 1];

console.log("Sorted ages:", sortedAges);
console.log("Minimum age:", minAge);
console.log("Maximum age:", maxAge);

// 2. Find the median age
const middleAgeIndex = Math.floor(sortedAges.length / 2);
let medianAge;

if (sortedAges.length % 2 === 0) {
  medianAge =
    (sortedAges[middleAgeIndex - 1] + sortedAges[middleAgeIndex]) / 2;
} else {
  medianAge = sortedAges[middleAgeIndex];
}

console.log("Median age:", medianAge);

// 3. Find the average age
const averageAge =
  ages.reduce((total, age) => total + age, 0) / ages.length;

console.log("Average age:", averageAge);

// 4. Find the age range
const ageRange = maxAge - minAge;
console.log("Age range:", ageRange);

// 5. Compare the absolute distances from the average
const minDistanceFromAverage = Math.abs(minAge - averageAge);
const maxDistanceFromAverage = Math.abs(maxAge - averageAge);

console.log("Distance from min to average:", minDistanceFromAverage);
console.log("Distance from max to average:", maxDistanceFromAverage);
console.log(
  "Are the distances equal?",
  minDistanceFromAverage === maxDistanceFromAverage
);

// 6. Slice the first ten countries
const firstTenCountries = countries.slice(0, 10);
console.log("First ten countries:", firstTenCountries);

// 7. Find the middle country or countries
const countryMiddle = Math.floor(countries.length / 2);
let middleCountries;

if (countries.length % 2 === 0) {
  middleCountries = countries.slice(countryMiddle - 1, countryMiddle + 1);
} else {
  middleCountries = [countries[countryMiddle]];
}

console.log("Middle country or countries:", middleCountries);

// 8. Divide countries into two halves.
// If the length is odd, the first half gets one extra country.
const firstHalfEnd = Math.ceil(countries.length / 2);
const firstHalf = countries.slice(0, firstHalfEnd);
const secondHalf = countries.slice(firstHalfEnd);

console.log("First half:", firstHalf);
console.log("Second half:", secondHalf);
