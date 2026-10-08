const checkSound = document.getElementById("check-sound");
const deleteSound = document.getElementById("delete-sound");
const container = document.querySelector(".container");
const headerContainer = document.querySelector(".header-container");
const appTitle = document.querySelector(".app-title");
const titleGroup = document.querySelector(".title-group");
const appDescription = document.querySelector(".app-description");
const taskEntryHeading = document.getElementById("task-entry-heading");
const tasksHeading = document.getElementById("tasks-heading");
const sectionHelp = document.querySelectorAll(".section-help");
const taskFields = document.querySelectorAll(".form-field");
const restoreBtn = document.getElementById("restore-button");
const row = document.getElementById("task-form");
const inputBox = document.getElementById("task-input");
const timeBox = document.getElementById("task-time");
const addButton = document.getElementById("add-task-button");
const listContainer = document.getElementById("task-list");
const taskTemplate = document.getElementById("task-template");

document.body.classList.add("app-page");
document.body.style.margin = "0";
document.body.style.padding = "20px";
document.body.style.boxSizing = "border-box";
document.body.style.fontFamily = "'Rajdhani', sans-serif";
document.body.style.width = "100%";
document.body.style.minHeight = "100vh";
document.body.style.background = "radial-gradient(circle at center, #0f0c20 0%, #060210 100%)";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.overflowX = "hidden";
document.body.style.position = "relative";

for (let i = 0; i < 15; i++) {
    let particle = document.createElement("div");
    particle.className = "background-particle";
    particle.style.position = "absolute";
    particle.style.width = Math.random() * 6 + 2 + "px";
    particle.style.height = particle.style.width;
    particle.style.background = i % 2 === 0 ? "#00ffcc" : "#ff007f";
    particle.style.borderRadius = "50%";
    particle.style.top = Math.random() * 100 + "vh";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
    particle.style.pointerEvents = "none";
    particle.setAttribute("aria-hidden", "true");
    document.body.appendChild(particle);
}

container.style.width = "100%";
container.style.maxWidth = "600px";
container.style.boxSizing = "border-box";
container.style.background = "rgba(20, 15, 38, 0.7)";
container.style.backdropFilter = "blur(12px)";
container.style.webkitBackdropFilter = "blur(12px)";
container.style.padding = "40px 30px";
container.style.borderRadius = "24px";
container.style.border = "1px solid rgba(255, 255, 255, 0.08)";
container.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.1)";
container.style.position = "relative";
container.style.zIndex = "1";

headerContainer.style.display = "flex";
headerContainer.style.justifyContent = "space-between";
headerContainer.style.alignItems = "center";
headerContainer.style.marginBottom = "30px";

appTitle.style.color = "#ffffff";
appTitle.style.fontFamily = "'Orbitron', sans-serif";
appTitle.style.margin = "0";
appTitle.style.fontSize = "1.8rem";
appTitle.style.letterSpacing = "2px";

titleGroup.style.display = "flex";
titleGroup.style.flexDirection = "column";
titleGroup.style.gap = "6px";

appDescription.style.margin = "0";
appDescription.style.color = "rgba(255, 255, 255, 0.65)";
appDescription.style.fontSize = "14px";

taskEntryHeading.style.margin = "0 0 6px";
taskEntryHeading.style.color = "#ffffff";
taskEntryHeading.style.fontSize = "1.1rem";

tasksHeading.style.margin = "0";
tasksHeading.style.color = "#ffffff";
tasksHeading.style.fontSize = "1.1rem";

sectionHelp.forEach(help => {
    help.style.margin = "0 0 14px";
    help.style.color = "rgba(255, 255, 255, 0.6)";
    help.style.fontSize = "13px";
});

restoreBtn.style.background = "transparent";
restoreBtn.style.border = "1px solid rgba(0, 255, 204, 0.3)";
restoreBtn.style.color = "#00ffcc";
restoreBtn.style.padding = "6px 14px";
restoreBtn.style.borderRadius = "8px";
restoreBtn.style.cursor = "pointer";
restoreBtn.style.fontSize = "12px";
restoreBtn.style.fontWeight = "600";
restoreBtn.style.transition = "all 0.2s";
restoreBtn.onmouseover = () => {
    restoreBtn.style.background = "rgba(0, 255, 204, 0.1)";
    restoreBtn.style.boxShadow = "0 0 10px rgba(0, 255, 204, 0.3)";
};
restoreBtn.onmouseout = () => {
    restoreBtn.style.background = "transparent";
    restoreBtn.style.boxShadow = "none";
};
restoreBtn.onclick = () => {
    localStorage.removeItem("coolChronoTasks");
    showTask();
};

row.classList.add("input-row");
row.style.display = "flex";
row.style.alignItems = "center";
row.style.background = "rgba(0, 0, 0, 0.3)";
row.style.borderRadius = "16px";
row.style.padding = "6px 6px 6px 18px";
row.style.marginBottom = "30px";
row.style.border = "1px solid rgba(255, 255, 255, 0.05)";
row.style.gap = "10px";

taskFields.forEach(field => {
    field.style.display = "flex";
    field.style.flexDirection = "column";
    field.style.gap = "5px";
    field.style.minWidth = "0";
});

document.querySelector(".task-name-field").style.flex = "2";
document.querySelector(".task-time-field").style.flex = "0.9";

row.querySelectorAll("label").forEach(label => {
    label.style.color = "rgba(255, 255, 255, 0.7)";
    label.style.fontSize = "11px";
});

inputBox.style.flex = "2";
inputBox.style.width = "100%";
inputBox.style.border = "none";
inputBox.style.outline = "none";
inputBox.style.background = "transparent";
inputBox.style.padding = "12px 0";
inputBox.style.fontSize = "15px";
inputBox.style.color = "#ffffff";

timeBox.style.flex = "0.9";
timeBox.style.width = "100%";
timeBox.style.border = "none";
timeBox.style.outline = "none";
timeBox.style.background = "rgba(255, 255, 255, 0.05)";
timeBox.style.padding = "10px";
timeBox.style.borderRadius = "10px";
timeBox.style.fontSize = "14px";
timeBox.style.color = "#00ffcc";
timeBox.style.fontFamily = "'Rajdhani', sans-serif";

addButton.style.border = "none";
addButton.style.outline = "none";
addButton.style.padding = "14px 28px";
addButton.style.background = "linear-gradient(90deg, #ff007f, #7928ca)";
addButton.style.color = "#ffffff";
addButton.style.fontSize = "14px";
addButton.style.fontWeight = "700";
addButton.style.fontFamily = "'Orbitron', sans-serif";
addButton.style.cursor = "pointer";
addButton.style.borderRadius = "12px";
addButton.style.boxShadow = "0 4px 15px rgba(255, 0, 127, 0.3)";
addButton.style.transition = "all 0.3s ease";

addButton.onmouseover = () => {
    addButton.style.boxShadow = "0 0 20px #ff007f";
    addButton.style.transform = "scale(1.02)";
};
addButton.onmouseout = () => {
    addButton.style.boxShadow = "0 4px 15px rgba(255, 0, 127, 0.3)";
    addButton.style.transform = "scale(1)";
};

listContainer.style.padding = "0";
listContainer.style.margin = "16px 0 0";
document.querySelector(".task-entry").style.marginBottom = "30px";
row.addEventListener("submit", event => {
    event.preventDefault();
    addTask();
});

document.querySelectorAll(".visually-hidden").forEach(label => {
    label.style.position = "absolute";
    label.style.width = "1px";
    label.style.height = "1px";
    label.style.padding = "0";
    label.style.margin = "-1px";
    label.style.overflow = "hidden";
    label.style.clip = "rect(0, 0, 0, 0)";
    label.style.whiteSpace = "nowrap";
    label.style.border = "0";
});

const defaultTasks = [
    { text: "Cybernetic Meditation & Focus Stretch", time: "06:30", completed: false },
    { text: "Nutrient Injection & Protein Coffee", time: "07:15", completed: false },
    { text: "Sync Terminals & Core Mail Pipeline", time: "08:00", completed: false },
    { text: "Global Node Team Synchronisation", time: "09:30", completed: false },
    { text: "Deep System Execution (Core Code)", time: "10:30", completed: false },
    { text: "Biometric Recovery Break & Rehydrate", time: "13:00", completed: false },
    { text: "Outer Node Response & Quality Review", time: "15:00", completed: false },
    { text: "Physical Chassis Calibration / Gym", time: "18:00", completed: false }
];

const STORAGE_KEY = "coolChronoTasks";
let tasks = [];

function formatTime12h(timeStr) {
    if (!timeStr) return "Anytime";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h < 10 ? "0" + h : h}:${minutes} ${ampm}`;
}

function getSortMinutes(timeStr) {
    if (!timeStr || timeStr === "Anytime") return 9999;
    let hours = 0, minutes = 0;
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const [time, modifier] = timeStr.split(" ");
        let [h, m] = time.split(":");
        hours = parseInt(h, 10);
        minutes = parseInt(m, 10);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
    } else {
        const [h, m] = timeStr.split(":");
        hours = parseInt(h, 10);
        minutes = parseInt(m, 10);
    }
    return hours * 60 + minutes;
}

function addTask() {
    if (inputBox.value.trim() === '') {
        alert("Command Empty: Please input text details.");
        return;
    }
    
    const formattedTime = timeBox.value ? formatTime12h(timeBox.value) : "Anytime";
    
    tasks.push({ text: inputBox.value.trim(), time: formattedTime, completed: false });
    
    inputBox.value = "";
    timeBox.value = "";
    
    renderSortedList(tasks);
    saveData();
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function showTask() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks !== null) {
            const storageTasks = JSON.parse(savedTasks);
            if (!Array.isArray(storageTasks)) {
                throw new Error("Saved tasks must be an array.");
            }
            tasks = storageTasks.map(task => ({
                text: task.text,
                time: task.time || "Anytime",
                completed: Boolean(task.completed)
            }));
        } else {
            tasks = defaultTasks.map(task => ({ ...task, completed: false }));
        }
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        tasks = defaultTasks.map(task => ({ ...task, completed: false }));
    }

    renderSortedList(tasks);
}

function renderSortedList(tasksArray) {
    tasks = tasksArray.map(task => ({
        text: task.text,
        time: task.time || "Anytime",
        completed: Boolean(task.completed)
    }));
    listContainer.innerHTML = "";
    tasks.sort((a, b) => getSortMinutes(a.time) - getSortMinutes(b.time));
    tasks.forEach((task, index) => createTaskElement(task, index));
}

function createTaskElement(task, taskIndex) {
    const { text: taskText, time: taskTime } = task;
    const li = taskTemplate.content.firstElementChild.cloneNode(true);
    const leftZone = li.querySelector(".task-main");
    const customCheckbox = li.querySelector(".task-checkbox");
    const marker = li.querySelector(".checkbox-marker");
    const textZone = li.querySelector(".task-details");
    const taskTextEl = li.querySelector(".task-text");
    const taskTimeEl = li.querySelector(".task-time");
    const deleteButton = li.querySelector(".delete-button");

    li.style.listStyle = "none";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.padding = "16px";
    li.style.marginBottom = "12px";
    li.style.background = "rgba(255, 255, 255, 0.02)";
    li.style.borderRadius = "14px";
    li.style.border = "1px solid rgba(255, 255, 255, 0.03)";
    li.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

    leftZone.style.display = "flex";
    leftZone.style.alignItems = "center";
    leftZone.style.gap = "16px";
    leftZone.style.flex = "1";

    customCheckbox.setAttribute("aria-label", `Mark "${taskText}" complete`);
    customCheckbox.style.width = "20px";
    customCheckbox.style.height = "20px";
    customCheckbox.style.padding = "0";
    customCheckbox.style.borderRadius = "6px";
    customCheckbox.style.border = "2px solid rgba(0, 255, 204, 0.4)";
    customCheckbox.style.cursor = "pointer";
    customCheckbox.style.display = "flex";
    customCheckbox.style.alignItems = "center";
    customCheckbox.style.justifyContent = "center";

    marker.style.opacity = "0";
    marker.style.color = "#00ffcc";
    marker.style.fontSize = "12px";
    marker.style.fontWeight = "700";
    customCheckbox.appendChild(marker);

    textZone.style.flex = "1";
    textZone.style.display = "flex";
    textZone.style.flexDirection = "column";
    textZone.style.gap = "4px";

    taskTextEl.textContent = taskText;
    taskTextEl.style.color = "#f5f5ff";
    taskTextEl.style.fontSize = "15px";
    taskTextEl.style.fontWeight = "600";
    taskTextEl.style.letterSpacing = "0.2px";
    taskTextEl.style.wordBreak = "break-word";

    taskTimeEl.textContent = formatTime12h(taskTime);
    taskTimeEl.style.color = "#00ffcc";
    taskTimeEl.style.fontSize = "12px";
    taskTimeEl.style.letterSpacing = "1px";
    taskTimeEl.style.textTransform = "uppercase";

    deleteButton.setAttribute("aria-label", `Delete "${taskText}"`);
    deleteButton.textContent = "✕";
    deleteButton.style.background = "rgba(255, 0, 127, 0.14)";
    deleteButton.style.border = "1px solid rgba(255, 0, 127, 0.35)";
    deleteButton.style.color = "#ff9ecf";
    deleteButton.style.borderRadius = "8px";
    deleteButton.style.width = "28px";
    deleteButton.style.height = "28px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.fontSize = "12px";
    deleteButton.style.transition = "all 0.2s ease";

    li.dataset.taskText = taskText;
    li.dataset.taskTime = taskTime;
    li.dataset.taskIndex = String(taskIndex);
    li.style.opacity = "1";

    customCheckbox.onclick = () => {
        const index = Number(li.dataset.taskIndex);
        if (Number.isNaN(index) || !tasks[index]) return;

        tasks[index].completed = !tasks[index].completed;
        li.classList.toggle("done", tasks[index].completed);
        taskTextEl.style.textDecoration = tasks[index].completed ? "line-through" : "none";
        taskTextEl.style.opacity = tasks[index].completed ? "0.55" : "1";
        customCheckbox.style.background = tasks[index].completed ? "rgba(0, 255, 204, 0.15)" : "transparent";
        customCheckbox.style.borderColor = tasks[index].completed ? "#00ffcc" : "rgba(0, 255, 204, 0.4)";
        marker.style.opacity = tasks[index].completed ? "1" : "0";
        customCheckbox.setAttribute("aria-pressed", String(tasks[index].completed));
        if (checkSound) checkSound.play().catch(() => {});
        saveData();
    };

    deleteButton.onclick = () => {
        const index = Number(li.dataset.taskIndex);
        if (!Number.isNaN(index)) {
            tasks.splice(index, 1);
            saveData();
            showTask();
        }
        if (deleteSound) deleteSound.play().catch(() => {});
    };

    const isComplete = tasks[taskIndex] && tasks[taskIndex].completed;
    customCheckbox.setAttribute("aria-pressed", String(Boolean(isComplete)));
    if (isComplete) {
        li.classList.add("done");
        taskTextEl.style.textDecoration = "line-through";
        taskTextEl.style.opacity = "0.55";
        customCheckbox.style.background = "rgba(0, 255, 204, 0.15)";
        customCheckbox.style.borderColor = "#00ffcc";
        marker.style.opacity = "1";
    }

    deleteButton.onmouseover = () => {
        deleteButton.style.background = "rgba(255, 0, 127, 0.22)";
        deleteButton.style.transform = "scale(1.05)";
    };
    deleteButton.onmouseout = () => {
        deleteButton.style.background = "rgba(255, 0, 127, 0.14)";
        deleteButton.style.transform = "scale(1)";
    };

    li.addEventListener("mouseenter", () => {
        li.style.borderColor = "rgba(0, 255, 204, 0.2)";
        li.style.boxShadow = "0 0 15px rgba(0, 255, 204, 0.1)";
    });
    li.addEventListener("mouseleave", () => {
        li.style.borderColor = "rgba(255, 255, 255, 0.03)";
        li.style.boxShadow = "none";
    });

    listContainer.appendChild(li);
    customCheckbox.style.transition = "all 0.2s";
}

showTask();
    
