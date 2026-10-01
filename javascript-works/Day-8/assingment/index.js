// ==========================================
// DAY 8 - ASSIGNMENT
// LEVEL 3
// ==========================================


// ==========================================
// ASSIGNMENT 1: PERSON ACCOUNT
// ==========================================

const personAccount = {

    firstName: "Oluwapelumi",

    lastName: "Olorunniyi",

    incomes: {
        salary: 200000,
        business: 100000
    },

    expenses: {
        food: 50000,
        transport: 30000
    },


    // Calculate total income
    totalIncome: function () {

        let total = 0;

        for (const income in this.incomes) {
            total += this.incomes[income];
        }

        return total;
    },


    // Calculate total expenses
    totalExpense: function () {

        let total = 0;

        for (const expense in this.expenses) {
            total += this.expenses[expense];
        }

        return total;
    },


    // Account information
    accountInfo: function () {

        return `${this.firstName} ${this.lastName}`;

    },


    // Add income
    addIncome: function (description, amount) {

        this.incomes[description] = amount;

    },


    // Add expense
    addExpense: function (description, amount) {

        this.expenses[description] = amount;

    },


    // Calculate account balance
    accountBalance: function () {

        return this.totalIncome() - this.totalExpense();

    }

};


// Test personAccount

console.log("Account Name:", personAccount.accountInfo());

console.log("Total Income:", personAccount.totalIncome());

console.log("Total Expense:", personAccount.totalExpense());

console.log("Account Balance:", personAccount.accountBalance());


// Add new income
personAccount.addIncome("freelance", 50000);

// Add new expense
personAccount.addExpense("internet", 10000);

console.log("New Income:", personAccount.totalIncome());

console.log("New Expense:", personAccount.totalExpense());

console.log("New Balance:", personAccount.accountBalance());


// ==========================================
// ASSIGNMENT 2: USERS ARRAY
// ==========================================

const users = [
    {
        _id: "ab12ex",
        username: "Alex",
        email: "alex@alex.com",
        password: "123123",
        createdAt: "08/01/2020 9:00 AM",
        isLoggedIn: false
    },

    {
        _id: "fg12cy",
        username: "Asab",
        email: "asab@asab.com",
        password: "123456",
        createdAt: "08/01/2020 9:30 AM",
        isLoggedIn: true
    },

    {
        _id: "zwf8md",
        username: "Brook",
        email: "brook@brook.com",
        password: "123111",
        createdAt: "08/01/2020 9:45 AM",
        isLoggedIn: true
    },

    {
        _id: "eefamr",
        username: "Martha",
        email: "martha@martha.com",
        password: "123222",
        createdAt: "08/01/2020 9:50 AM",
        isLoggedIn: false
    },

    {
        _id: "ghderc",
        username: "Thomas",
        email: "thomas@thomas.com",
        password: "123333",
        createdAt: "08/01/2020 10:00 AM",
        isLoggedIn: false
    }
];


// ==========================================
// SIGN UP
// ==========================================

function signUp(username, email, password) {

    const existingUser = users.find(function (user) {

        return user.email === email;

    });


    if (existingUser) {

        return "You already have an account.";

    }


    const newUser = {

        _id: Date.now().toString(),

        username: username,

        email: email,

        password: password,

        createdAt: new Date().toLocaleString(),

        isLoggedIn: false

    };


    users.push(newUser);

    return "Account created successfully.";

}


// Test signUp

console.log(
    signUp(
        "David",
        "david@gmail.com",
        "123456"
    )
);


// ==========================================
// SIGN IN
// ==========================================

function signIn(email, password) {

    const user = users.find(function (user) {

        return (
            user.email === email &&
            user.password === password
        );

    });


    if (!user) {

        return "Invalid email or password.";

    }


    user.isLoggedIn = true;

    return `Welcome ${user.username}`;

}


// Test signIn

console.log(
    signIn(
        "asab@asab.com",
        "123456"
    )
);


// ==========================================
// ASSIGNMENT 3: PRODUCTS
// ==========================================

const products = [

    {
        _id: "eedfcf",

        name: "mobile phone",

        description: "Huawei Honor",

        price: 200,

        ratings: [
            {
                userId: "fg12cy",
                rate: 5
            },

            {
                userId: "zwf8md",
                rate: 4.5
            }
        ],

        likes: []
    },


    {
        _id: "aegfal",

        name: "Laptop",

        description: "MacPro: System Darwin",

        price: 2500,

        ratings: [],

        likes: ["fg12cy"]
    },


    {
        _id: "hedfcg",

        name: "TV",

        description: "Smart TV: Procaster",

        price: 400,

        ratings: [
            {
                userId: "fg12cy",
                rate: 5
            }
        ],

        likes: ["fg12cy"]
    }

];


// ==========================================
// RATE PRODUCT
// ==========================================

function rateProduct(productId, userId, rate) {

    const product = products.find(function (product) {

        return product._id === productId;

    });


    if (!product) {

        return "Product not found.";

    }


    product.ratings.push({

        userId: userId,

        rate: rate

    });


    return "Product rated successfully.";

}


// Test rateProduct

console.log(
    rateProduct(
        "aegfal",
        "ab12ex",
        5
    )
);


// ==========================================
// AVERAGE RATING
// ==========================================

function averageRating(productId) {

    const product = products.find(function (product) {

        return product._id === productId;

    });


    if (!product) {

        return "Product not found.";

    }


    if (product.ratings.length === 0) {

        return 0;

    }


    let total = 0;


    product.ratings.forEach(function (rating) {

        total += rating.rate;

    });


    return total / product.ratings.length;

}


// Test averageRating

console.log(
    "Average rating:",
    averageRating("eedfcf")
);


// ==========================================
// ASSIGNMENT 4: LIKE PRODUCT
// ==========================================

function likeProduct(productId, userId) {

    const product = products.find(function (product) {

        return product._id === productId;

    });


    if (!product) {

        return "Product not found.";

    }


    const userIndex = product.likes.indexOf(userId);


    // If user has NOT liked the product
    if (userIndex === -1) {

        product.likes.push(userId);

        return "Product liked.";

    }


    // If user already liked the product
    product.likes.splice(userIndex, 1);

    return "Product unliked.";

}


// Test likeProduct

console.log(
    likeProduct(
        "eedfcf",
        "ab12ex"
    )
);