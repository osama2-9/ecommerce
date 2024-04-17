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
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll(".flip-card");

    productCards.forEach(function (card) {
      const productName = card
        .querySelector(".card-title")
        .textContent.toLowerCase();

      if (productName.includes(searchTerm)) {
        card.style.display = "block"; // Show the card if the search term matches
      } else {
        card.style.display = "none"; // Hide the card if the search term does not match
      }
    });
  });
