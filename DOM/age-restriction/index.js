const registrationForm = document.querySelector("#registration-form");
const nameInput = document.querySelector("#reg-name");
const ageInput = document.querySelector("#reg-age");
const messagePanel = document.querySelector("#message-panel");
function showMessage(message, type) {
    messagePanel.textContent = message;
    messagePanel.className = `message-panel message-${type}`;
    messagePanel.hidden = false;
}
registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const age = Number(ageInput.value);
    if (!Number.isInteger(age) || age < 0 || age > 130) {
        showMessage("Enter a valid age as a whole number between 0 and 130.", "warning");
        ageInput.focus();
        return;
    }
    if (age >= 18) {
        const firstName = nameInput.value.trim().split(/\s+/)[0];
        showMessage(`You’re eligible to register. Welcome, ${firstName}!`, "success");
        registrationForm.reset();
        return;
    }
    showMessage("You must be at least 18 years old to register.", "error");
});
