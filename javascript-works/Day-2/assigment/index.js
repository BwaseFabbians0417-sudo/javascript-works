
let challenge = '30 Days Of JavaScript'
let social = 'Facebook, Google, Microsoft, Apple, IBM, Oracle, Amazon' 
let conjuction = 'You cannot end a sentence with because because because is a conjunction'

console.log(challenge);
console.log(challenge.length);
console.log(challenge.toUpperCase());
console.log(challenge.toLowerCase());
console.log(challenge.substr(3,19));
console.log(challenge.substring(3,11));
console.log(challenge.substr(3,19));
console.log(challenge.includes('Script'));
console.log(challenge.split(''));
console.log(challenge.split(" "));
console.log(challenge.replace("JavaScript", "Python"));
console.log(challenge.charAt(15));
console.log(challenge.indexOf('a'));
console.log(challenge.lastIndexOf('a'));
console.log(conjuction.indexOf('because'));
console.log(conjuction.lastIndexOf('because'));
console.log(conjuction.search('because'));
console.log(challenge.trim());
console.log(challenge.startsWith('30 Days Of JavaScript'));
console.log(challenge.endsWith('30 Days Of JavaScript'));
console.log(challenge.match('a'));
console.log(challenge.repeat(2));

let text1 = '30 Days Of';
let text2 = ' JavaScript';

console.log(text1.concat(text2));



console.log(social.split(","));