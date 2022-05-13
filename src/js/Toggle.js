const searchBox = document.querySelector("#search-box");
const searchToggle = document.querySelector("#search-toggle");

const productToggle = document.querySelector("#product-toggle");
const formProduct = document.querySelector("#form-product");

const categoryToggle = document.querySelector("#category-toggle");
const formCategory = document.querySelector("#form-category");

class Toggle {
  constructor() {
    searchToggle.addEventListener("click", this.searchHandlerToggle);

    productToggle.addEventListener("click", this.showProduct);
    document
      .querySelector("#exit-form-product")
      .addEventListener("click", this.exitProduct);

    categoryToggle.addEventListener("click", this.showCategory);
    document
      .querySelector("#exit-form-category")
      .addEventListener("click", this.exitCategory);
  }

  // search toggle
  searchHandlerToggle() {
    search.classList.toggle("hidden");
    search.classList.toggle("block");
    searchBox.classList.toggle("bg-gray-200");
    search.focus();
  }

  // product form toggle
  showProduct = () => {
    formProduct.classList.remove("hidden");
    formProduct.classList.add("fixed");
    document.querySelector("#product-title").focus();
  };

  exitProduct = () => {
    formProduct.classList.add("hidden");
    formProduct.classList.remove("fixed");
  };

  // category form toggle
  showCategory = () => {
    this.exitProduct();
    formCategory.classList.remove("hidden");
    formCategory.classList.add("fixed");
    document.querySelector("#category-title").focus();
  };

  exitCategory = () => {
    this.showProduct();
    formCategory.classList.add("hidden");
    formCategory.classList.remove("fixed");
  };
}

export default new Toggle();
