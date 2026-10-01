// FUNCTION 

function addNum(a, b)  {
    console.log(a + b)
}

addNum(1, 4)
addNum(100, 6000)

const printNum = function() {
    
}

//Write a function to welcome each student to the class

// function greetings(name) {
    
//     return `welcome to the class, ${name}!`
    
// }
//  console.log(greetings("peace"))
//  console.log(greetings("john"))
//  console.log(greetings("mary"))

// num1 + num2

const sum = function(num1, num2) {
    return num1 + num2;
}
console.log(sum(5, 10))
console.log(sum(50, 90))


// num1 operand
// + - * opcode

// arrow function and flat arrow

const calculator = (num1, num2, opCode) => {
   if(opCode === "+") {
    return num1 + num2;
   } else if (opCode === "-") {
    return num2 - num1
   } else if (opCode === "*") {
    return num1 * num2
   } else if (opCode === "/") {
    return num1 / num2
   } else {
    return `Invalid Operation code`
   }
}
console.log(calculator(5, 6, "+"))
console.log(calculator(5, 6, "-"))

const countries = ["Nigeria", "Ghana", "Togo"]
const fruits = ['banana', 'orange', 'mango', 'lemon'] // array of strings, fruits
const vegetables = ['Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot'] // array of strings, vegetables
const animalProducts = ['milk', 'meat', 'butter', 'yoghurt'] // array of strings, products
const webTechs = ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node', 'MongDB'] // array of web technologies

// function that takes an array

function acceptArr(arr) {
    for (let i = 0; i < arr.length; i++){
        console.log(arr[i].toUpperCase())
    }
    
}
acceptArr(countries)
acceptArr(webTechs)