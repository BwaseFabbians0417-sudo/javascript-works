const displayEL = document.querySelector("#display");
const incEL = document.querySelector("#btn-inc");
const decEL = document.querySelector("#btn-dec");
const resEL = document.querySelector("#btn-res");
const postsListEL = document.querySelector(".typicode");

let count = 0;

function updateDisplay() {
    if (displayEL) {
        displayEL.textContent = count;
    }
}

if (incEL) {
    incEL.addEventListener("click", function () {
        count += 1;
        updateDisplay();
    });
}

if (decEL) {
    decEL.addEventListener("click", function () {
        if (count > 0) {
            count -= 1;
        }
        updateDisplay();
    });
}

if (resEL) {
    resEL.addEventListener("click", function () {
        count = 0;
        updateDisplay();
    });
}

if (postsListEL) {
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch posts");
            }
            return res.json();
        })
        .then((data) => {
            data.forEach((post) => {
                const listItem = document.createElement("li");
                listItem.textContent = post.title;
                postsListEL.appendChild(listItem);
            });
        })
        .catch((error) => {
            const errorItem = document.createElement("li");
            errorItem.textContent = "Unable to load posts.";
            postsListEL.appendChild(errorItem);
            console.error(error);
        });
}

updateDisplay();