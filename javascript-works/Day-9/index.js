// Higher order function 

// function mutiplyby2 (n) : Number  {
     
//     return n * 2
// }

// console.log(mutiplyby2(3))

function cube(mutiplyBY2, num) {

    return mutiplyBY2(num)* num


}


console.log(cube(mutiplyBy2, 3));


//map,filter,reduce,foreach

const numbers = [1, 2, 3, 4, 5];

const mappedArr = numbers.map((n) => n * 2);

console.log(mappedArr);

numbers.forEach((num) =>{
    console.log (num * 2)
    
});

// console.log(dop)
const fruits = [ 'banana','orange','mango','lemon']
const fruitsMappped = fruits.map((fruit) => fruit.toUpperCase());
console.log(fruitsMappped);


const filterfruit = fruits.filter((fruit) => fruit.length <5);

console.log(filterfruit)