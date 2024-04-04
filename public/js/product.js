const incrementBtn = document.getElementById("increment");
const decrementBtn = document.getElementById("decrement");
const value = document.querySelector(".value");

let quntity = 0;

function updateValue() {
  value.innerHTML = quntity;
}

incrementBtn.addEventListener("click", function () {
  quntity++;
  updateValue();
});

decrementBtn.addEventListener("click", function () {
  if (quntity > 0) {
    quntity--;
    updateValue();
  }
});

function toggleShadow(checkbox) {
  if (checkbox.checked) {
    checkbox.classList.add("shadow");
  } else {
    checkbox.classList.remove("shadow");
  }
}
