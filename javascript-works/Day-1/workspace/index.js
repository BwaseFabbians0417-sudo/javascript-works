//syntax

let score = 101;
let grade =""

//switch statement

switch (true) {
    case score>= 70 && score<  101:
    console.log("Excellent")
    break; 
    case score>= 60:
    console.log("Very Good")
    break;
    case score>=  50:
    console.log("Good")
    break;
    case score>=  45:
    console.log("Pass")
    break;
    case score>=  40:
    console.log("Fair")
    break;
    default:
    console.log("fail")
}

let weather = "cloudy"
switch (weather) {
    case "sunny":
      console.log("The Weather Is Sunny")
    break;
    case "cold":
     console.log("The Weather is cold");
    break;
    case"raining":
    console.log("The Weather Is raining");
    break;
    default:
        console.log("Invalid weather");

}
// if(score >= 70) {
//     // grade = "Excellent" if this  failed then else block will run
//     console.log("Excellent")


// } else{
//     console.log("your score is less than 70")
// }


// if( score >= 70) {
//     console.log("Excellent");
// } else if ( score >= 60){
//     console.log("Very Good")
// } else if( score >= 50){
//     console.log("Good")
// } else if (score >= 45){
//     console.log("Pass")
// } else if ( score >= 40){
//     console.log("Fair")
// } else{
//     console.log("fail")
// }

let a =10;
let b =10;
let c =a+b;
console.log(c);
