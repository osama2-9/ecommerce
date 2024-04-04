let span = document.querySelector(".top");
window.onscroll = function () {
  if (this.scrollY >= 660) {
    span.classList.add("show");
  } else {
    span.classList.remove("show");
  }
};

span.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
