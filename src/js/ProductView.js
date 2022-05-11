import Storage from "./Storage.js";

const productList = document.querySelector("#productList");
const productTitle = document.querySelector("#product-title");
const productQuantity = document.querySelector("#product-quantity");
const addBtn = document.querySelector("#product-add");

const search = document.querySelector("#search");
const sort = document.querySelector("#sort");

class ProductView {
  constructor() {
    addBtn.addEventListener("click", (e) => this.addNewProduct(e));
    this.allProducts = Storage.getAllProducts();
    this.sorted = "newest";
    search.addEventListener("input", (e) => this.searchProduct(e.target.value));
    sort.addEventListener("change", (e) => this.sortProduct(e.target.value));
  }

  addNewProduct(e) {
    e.preventDefault();
    const title = productTitle.value;
    const quantity = productQuantity.value;
    const category = document.querySelector("#categoryList").value;
    if (!category || !title || (!quantity || quantity <= 0)) return;
    Storage.saveProducts({ title, quantity, category });
    this.sortProduct(this.sorted);
    productTitle.value = "";
    productQuantity.value = "";
  }
  createProductsList() {
    let result = "";
    this.allProducts.forEach((item) => {
      const date = new Date(item.updated).toLocaleDateString("fa-IR");
      const category = Storage.getAllCategories().find(
        (c) => c.id === parseInt(item.category)
      );
      result += `
      <ul class="flex items-center justify-between w-full">

        <li>${item.title}</li>
        <li>${category.title}</li>
        <li>${item.quantity}</li>
        <li>${date}</li>

      </ul>
      `;
    });
    productList.innerHTML = result;
  }

  searchProduct(value) {
    const filtered = Storage.getAllProducts().filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    this.sortProduct(this.sorted, filtered);
  }

  sortProduct(value, products = Storage.getAllProducts()) {
    switch (value) {
      case "newest": {
        const sorted = products.sort((a, b) => {
          return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
        this.allProducts = sorted;
        break;
      }
      case "oldest": {
        const sorted = products.sort((a, b) => {
          return new Date(a.updated) < new Date(b.updated) ? -1 : 1;
        });
        this.allProducts = sorted;
        break;
      }
      case "stock": {
        const sorted = products.sort((a, b) => {
          return parseInt(a.quantity) > parseInt(b.quantity) ? -1 : 1;
        });
        this.allProducts = sorted;
        break;
      }
      case "high": {
        const sorted = products.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        this.allProducts = sorted;
        break;
      }
      case "low": {
        const sorted = products.sort((a, b) => {
          return b.title.localeCompare(a.title);
        });
        this.allProducts = sorted;
        break;
      }
      default:
        break;
    }
    this.createProductsList();
    this.sorted = value;
  }
}

export default new ProductView();
