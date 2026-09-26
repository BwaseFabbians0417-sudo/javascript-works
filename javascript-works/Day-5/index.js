// const nums = new Array()

// const nums = [1,2,7, "Books", null,undefined,{name: "Doe"},["one","two"] ]

// console.log(nums[6]. name)
// console.log(nums.length)


const numbers = [0, 3.14, 9.81, 37, 98.6, 100] // array of numbers
const fruits = ['banana', 'orange', 'mango', 'lemon'] // array of strings, fruits
const vegetables = ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot'] // array of strings, vegetables
const animalProducts = ['milk', 'meat', 'butter', 'yoghurt'] // array of strings, products
const webTechs = ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node', 'MongDB'] // array of web technologies
const countries = ['Finland', 'Denmark', 'Sweden', 'Norway', 'Iceland'] // array of strings, countries

console.log("The length of the fruit array is:", fruits.length)

const arr = [
    { country: "Nigeria"},
    { skills: "coding",level:"4"},
    "pencils", true, false, 56,
    { skills:["football","coding","js",]}
]

console.log(arr.length)

let js ='Javascript is a good programming'


 let splited= js.split(",")
console.log(splited)


const nums = [1,2,3,4,5]
const nums2 =[7,8,9,20];

let joinedArr =nums.concat(nums2, [12,22,34])
console.log(joinedArr)

// joined word for programming


let lastIndx = nums.length -1
console.log(nums[lastIndx]);

// console.log(nums. lastIndexOf(1))
// console.log(nums.lastIndexOf(5))
// nums.push(100);
// nums.pop()
// console.log(nums)
// nums2.unshift(200)
// nums2.shift()
// console.log(num2);
console.log(nums.slice(0,2))

const webTechs1 = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Redux',
  'Node',
  'MongoDB'
] // List of web technologies

console.log[ webTechs1.includes("redux")]
console.log[ webTechs1.includes("code")]

let age = 56
console.log(Array.isArray(nums))
console.log(Array.isArray(age))
const names = ['Asabeneh', 'Mathias', 'Elias', 'Brook']
const alp =["T","Z","w","B","G","c","A"]
console.log(nums.join())
console.log(nums.join(" "))
console.log(nums.join("%"))

// console.log(webTechs1.slice(1,3))
// console.log(webTechs1.slice())
// (webTechs1.slice(2, 2,"web","codes"))
// console.log(webTechs1)
// console.log(nums.reverse())
console.log(alp.sort())