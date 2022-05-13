import Storage from "./Storage.js";
import Toggle from "./Toggle.js";

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
    if (!title) {
      productTitle.focus();
      return;
    } else if (!quantity || quantity <= 0) {
      productQuantity.focus();
      return;
    } else if (!category) {
      document.querySelector("#categoryList").focus();
      return;
    }

    Storage.saveProducts({ title, quantity, category });
    Toggle.exitProduct();
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
      class="grid grid-cols-12 items-center gap-x-2 w-full bg-white py-4 px-2 rounded-lg shadow-md text-sm mb-2"
    >
      <li class="col-span-2 whitespace-nowrap text-ellipsis overflow-hidden ">
      <span class="block w-3 h-3 rounded-full mr-0.5 md:mx-2 ${
        item.quantity >= 100
          ? "bg-green-500"
          : item.quantity >= 50
          ? "bg-orange-400"
          : "bg-red-600"
      } "></span>
      </li>
      <li
        class="col-span-3 flex flex-col items-start justify-center text-right"
      >
        <p class="font-medium w-full text-ellipsis overflow-hidden whitespace-nowrap">${
          item.title
        }</p>
        <p class="text-gray-400 text-xs w-full text-ellipsis overflow-hidden whitespace-nowrap">${
          category.title
        }</p>
      </li>
      <li class="col-span-2 whitespace-nowrap text-ellipsis overflow-hidden text-center">${
        item.quantity
      }</li>
      <li class="col-span-3 whitespace-nowrap text-ellipsis overflow-hidden text-center ">${date}</li>
      <li class="col-span-2 text-center">
        <button
        data-id=${item.id}
          class="delete-product border border-red-500 py-1.5 px-2 ml-0.5 md:m-0 rounded-md text-xs text-red-500 bg-white"
        >
          حذف
        </button>
      </li>
    </ul>
      `;
    });
    productList.innerHTML = result;
    this.deleteProduct();
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

  deleteProduct() {
    const deleteBtns = [...document.querySelectorAll(".delete-product")];
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        Storage.deleteProducts(e.target.dataset.id);
        this.sortProduct(this.sorted);
      });
    });
  }
}

export default new ProductView();
