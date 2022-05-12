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
    if (!category || !title || !quantity || quantity <= 0) return;
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
      <ul
      class="flex items-center justify-between gap-x-2 w-full bg-white p-4 rounded-lg shadow-md text-sm mb-2"
    >
      <li class="w-1/12 whitespace-nowrap text-ellipsis overflow-hidden ">
      <span class="block w-3 h-3 rounded-full mx-auto ${
        item.quantity >= 100
          ? "bg-green-500"
          : item.quantity >= 50
          ? "bg-orange-400"
          : "bg-red-600"
      } "></span>
      </li>
      <li
        class="flex flex-col items-start justify-center w-5/12 whitespace-nowrap text-right pr-4"
      >
        <p class="font-medium w-full text-ellipsis overflow-hidden">${
          item.title
        }</p>
        <p class="text-gray-400 text-xs w-full text-ellipsis overflow-hidden">${
          category.title
        }</p>
      </li>
      <li class="w-2/12 whitespace-nowrap text-ellipsis overflow-hidden text-center">${
        item.quantity
      }</li>
      <li class="w-2/12 whitespace-nowrap text-ellipsis overflow-hidden text-left ">${date}</li>
      <li class="w-2/12 text-center">
        <button
        data-id=${item.id}
          class="border w-full border-red-500 py-1.5 px-2 rounded-md text-xs text-red-500 bg-white"
        >
          حذف
        </button>
      </li>
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
