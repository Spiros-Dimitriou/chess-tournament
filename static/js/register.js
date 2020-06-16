let eloSelectBox = document.getElementById("rank");
let registerCheckbox = document.querySelector("#register-button");
let unlimitedCheckbox = document.querySelector("#game-unlimited");
let min10Checkbox = document.querySelector("#game-10min");
let min5Checkbox = document.querySelector("#game-5min");
let registerButton = document.querySelector('#register-button');
let gameTypeRequiredMesssage = document.getElementById("game-type-required-message");
eloSelectBox.selectedIndex = 2;
disableUnlCheckbox();
eloSelectBox.addEventListener("change", disableUnlCheckbox);
unlimitedCheckbox.addEventListener("change", reqCheckbox);
min5Checkbox.addEventListener("change", reqCheckbox);
min10Checkbox.addEventListener("change", reqCheckbox);
reqCheckbox();

function disableUnlCheckbox() {
    if (eloSelectBox.selectedIndex === 2) {
        unlimitedCheckbox.setAttribute("disabled", "");
        unlimitedCheckbox.checked = false;
    }
    else {
        unlimitedCheckbox.removeAttribute("disabled", "");
    }
}

function reqCheckbox() {
    console.log("checkbox clicked");
    if (unlimitedCheckbox.checked || min5Checkbox.checked || min10Checkbox.checked) {
        registerButton.disabled = false;
        console.log("at least one checked");
        gameTypeRequiredMesssage.style.visibility= 'hidden';
    }
    else {
        registerButton.disabled = true;
        console.log("none checked");
        gameTypeRequiredMesssage.style.visibility= '';
    }
}