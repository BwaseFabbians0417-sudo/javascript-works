// loop 1 - 50 using for-loop


// for (let k = 1; k<= 50; k++) {

//     console.log(k)
// }

// for (let k = 50; k>= 1; k--) {

//     console.log(k)



// }
let arr = [1, 2, 3, 4, 5]
// 0 1 2 3 4
for( let i = 0; i < arr.length; i++){
    console.log(arr[i])
}

let fruits = ["Orange", "Banana", "Apple", "Vegetable"]
for(let i = 0; i < fruits.length; i++){
    console.log(fruits[i].toUpperCase())
}


let emptyArr = [];
for(let i = 0; i <fruits.length; i++){
//  emptyArr[i] = fruits[i].toUpperCase()
emptyArr.push(fruits[i].toUpperCase())
}


console.log(emptyArr)


for (let fruit of fruits){
    console.log(fruit)
}

const person = [
    {
        name: "Doe",
        age:700,
        isStudent:true
    },
    {
        name: "Adex",
        age: 900,
        isStudent:true
    },
    {
        name:"Folla",
        age:100,
        isStudent:false
    }
]

// console.log(person[0])

for(let p of person){
    console.log(p["age"])
}


// while loop

let c = 1;
while(c <= 8) {
    console.log(c)

    c++
}
do{
    console.log(c)
    c++;

}

while(c > 5);