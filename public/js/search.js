

searchorder.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const productRows = document.querySelectorAll("table tbody tr");

  productRows.forEach(function (row) {
    const productName = row
      .querySelector("td:nth-child(2)")
      .textContent.trim()
      .toLowerCase();

    if (productName.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const orderRows = document.querySelectorAll(".ordertable tbody tr");

  orderRows.forEach(function (row) {
    const username = row
      .querySelector("td.user")
      .textContent.trim()
      .toLowerCase();
    const productName = row
      .querySelector("td:nth-child(2)")
      .textContent.trim()
      .toLowerCase();

    if (username.includes(searchTerm) || productName.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
const products = document.querySelectorAll(".someProduct .col");

document.getElementById("searchButton").addEventListener("click", function () {
  filterProducts(searchInput.value.toLowerCase());
});

searchInput.addEventListener("input", function () {
  filterProducts(searchInput.value.toLowerCase());
});

function filterProducts(searchTerm) {
  products.forEach(function (product) {
    const productName = product
      .querySelector(".card-title")
      .textContent.toLowerCase();

    if (productName.includes(searchTerm)) {
      product.style.display = "";
    } else {
      product.style.display = "none";
    }
  });
}
