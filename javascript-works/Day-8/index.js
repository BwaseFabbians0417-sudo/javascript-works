// ==========================================
// DAY 8 - CLASS EXERCISES
// ==========================================


// ==========================================
// EXERCISE 1: DOG OBJECT
// ==========================================

// 1. Create an empty object called dog
const dog = {};

// 2. Print the dog object
console.log(dog);

// 3. Add name, legs, color, age and bark properties

dog.name = "Buddy";
dog.legs = 4;
dog.color = "Brown";
dog.age = 3;

dog.bark = function () {
    return "woof woof";
};

// 4. Get name, legs, color, age and bark value

console.log(dog.name);
console.log(dog.legs);
console.log(dog.color);
console.log(dog.age);
console.log(dog.bark());

// 5. Set new properties: breed and getDogInfo

dog.breed = "German Shepherd";

dog.getDogInfo = function () {
    return `${this.name} is a ${this.breed}. 
It is ${this.age} years old and has ${this.legs} legs.`;
};

console.log(dog.getDogInfo());


// ==========================================
// EXERCISE 2: USERS OBJECT
// ==========================================

const users = {
    Alex: {
        email: "alex@alex.com",
        skills: ["HTML", "CSS", "JavaScript"],
        age: 20,
        isLoggedIn: false,
        points: 30
    },

    Asab: {
        email: "asab@asab.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Redux",
            "MongoDB",
            "Express",
            "React",
            "Node"
        ],
        age: 25,
        isLoggedIn: false,
        points: 50
    },

    Brook: {
        email: "daniel@daniel.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Redux"
        ],
        age: 30,
        isLoggedIn: true,
        points: 50
    },

    Daniel: {
        email: "daniel@alex.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Python"
        ],
        age: 20,
        isLoggedIn: false,
        points: 40
    },

    John: {
        email: "john@john.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Redux",
            "Node.js"
        ],
        age: 20,
        isLoggedIn: true,
        points: 50
    },

    Thomas: {
        email: "thomas@thomas.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React"
        ],
        age: 20,
        isLoggedIn: false,
        points: 40
    },

    Paul: {
        email: "paul@paul.com",
        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "MongoDB",
            "Express",
            "React",
            "Node"
        ],
        age: 20,
        isLoggedIn: false,
        points: 40
    }
};


// ==========================================
// 1. FIND PERSON WITH MANY SKILLS
// ==========================================

let personWithMostSkills = "";
let mostSkills = 0;

for (const user in users) {

    if (users[user].skills.length > mostSkills) {

        mostSkills = users[user].skills.length;
        personWithMostSkills = user;

    }
}

console.log("Person with most skills:", personWithMostSkills);
console.log("Number of skills:", mostSkills);


// ==========================================
// 2. COUNT LOGGED-IN USERS
// ==========================================

let loggedInUsers = 0;

for (const user in users) {

    if (users[user].isLoggedIn === true) {
        loggedInUsers++;
    }

}

console.log("Logged-in users:", loggedInUsers);


// ==========================================
// 3. COUNT USERS WITH 50 OR MORE POINTS
// ==========================================

let usersWith50Points = 0;

for (const user in users) {

    if (users[user].points >= 50) {
        usersWith50Points++;
    }

}

console.log("Users with 50 or more points:", usersWith50Points);


// ==========================================
// 4. FIND MERN STACK DEVELOPERS
// ==========================================

console.log("MERN developers:");

for (const user in users) {

    const skills = users[user].skills;

    if (
        skills.includes("MongoDB") &&
        skills.includes("Express") &&
        skills.includes("React") &&
        skills.includes("Node")
    ) {

        console.log(user);

    }
}


// ==========================================
// 5. ADD YOUR NAME WITHOUT MODIFYING
//    THE ORIGINAL USERS OBJECT
// ==========================================

const newUsers = Object.assign({}, users);

newUsers.Oluwapelumi = {
    email: "oluwapelumi@example.com",
    skills: [
        "HTML",
        "CSS",
        "JavaScript"
    ],
    age: 20,
    isLoggedIn: true,
    points: 50
};

console.log("New users object:", newUsers);


// ==========================================
// 6. GET ALL KEYS / PROPERTIES
// ==========================================

console.log("User keys:");

console.log(Object.keys(users));


// ==========================================
// 7. GET ALL VALUES
// ==========================================

console.log("User values:");

console.log(Object.values(users));