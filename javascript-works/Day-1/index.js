// Exercise: Level 1

let challenge = "30 Days Of JavaScript";

// 1. Print the string
console.log(challenge);
// Output: 30 Days Of JavaScript

// 2. Print the length of the string
console.log(challenge.length);
// Output: 21

// 3. Change all characters to capital letters
console.log(challenge.toUpperCase());
// Output: 30 DAYS OF JAVASCRIPT

// 4. Change all characters to lowercase letters
console.log(challenge.toLowerCase());
// Output: 30 days of javascript

// 5. Cut out the first word
// substring() is recommended instead of the older substr() method.
console.log(challenge.substring(0, 2));
// Output: 30

// 6. Slice out "Days Of JavaScript"
console.log(challenge.slice(3));
// Output: Days Of JavaScript

// 7. Check whether the string contains "Script"
console.log(challenge.includes("Script"));
// Output: true

// 8. Split the string into an array
console.log(challenge.split());
// Output: ["30 Days Of JavaScript"]

// 9. Split the string at each space
console.log(challenge.split(" "));
// Output: ["30", "Days", "Of", "JavaScript"]

// 10. Split the company names at the comma
let companies =
  "Facebook, Google, Microsoft, Apple, IBM, Oracle, Amazon";

console.log(companies.split(", "));
// Output:
// ["Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"]

// 11. Change JavaScript to Python
console.log(challenge.replace("JavaScript", "Python"));
// Output: 30 Days Of Python

// 12. Find the character at index 15
console.log(challenge.charAt(15));
// Output: S

// 13. Find the character code of J
console.log(challenge.charCodeAt(challenge.indexOf("J")));
// Output: 74

// 14. Find the position of the first occurrence of "a"
console.log(challenge.indexOf("a"));
// Output: 4

// 15. Find the position of the last occurrence of "a"
console.log(challenge.lastIndexOf("a"));
// Output: 14

// Sentence for the next three exercises
let sentence =
  "You cannot end a sentence with because because because is a conjunction";

// 16. Find the first occurrence of "because" using indexOf()
console.log(sentence.indexOf("because"));
// Output: 31

// 17. Find the last occurrence of "because" using lastIndexOf()
console.log(sentence.lastIndexOf("because"));
// Output: 47

// 18. Find the first occurrence of "because" using search()
console.log(sentence.search("because"));
// Output: 31

// 19. Remove whitespace at the beginning and end
let textWithSpaces = " 30 Days Of JavaScript ";

console.log(textWithSpaces.trim());
// Output: 30 Days Of JavaScript

// 20. Check whether the string starts with "30"
console.log(challenge.startsWith("30"));
// Output: true

// 21. Check whether the string ends with "JavaScript"
console.log(challenge.endsWith("JavaScript"));
// Output: true

// 22. Find all the letter "a" characters
console.log(challenge.match(/a/g));
// Output: ["a", "a", "a"]

// 23. Merge two strings using concat()
let firstPart = "30 Days Of";
let secondPart = "JavaScript";

console.log(firstPart.concat(" ", secondPart));
// Output: 30 Days Of JavaScript

// 24. Print the string two times
console.log(challenge.repeat(2));
// Output: 30 Days Of JavaScript30 Days Of JavaScript
