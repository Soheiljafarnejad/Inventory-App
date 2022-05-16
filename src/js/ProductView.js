import CategoryView from "./CategoryView.js";
import Storage from "./Storage.js";
import Toggle from "./Toggle.js";

const productFromTitle = document.querySelector("#productFrom-title");
const productList = document.querySelector("#productList");
const productTitle = document.querySelector("#product-title");
const categoryList = document.querySelector("#categoryList");
const productQuantity = document.querySelector("#product-quantity");
const addBtn = document.querySelector("#product-add");

const search = document.querySelector("#search");
const sort = document.querySelector("#sort");
class ProductView {
  constructor() {
    addBtn.addEventListener("click", (e) => this.addNewProduct(e));
    this.allProducts = Storage.getAllProducts();
    this.sorted = "newest";
    this.EditId = null;
    search.addEventListener("input", (e) => this.searchProduct(e.target.value));
    sort.addEventListener("change", (e) => this.sortProduct(e.target.value));
  }

  addNewProduct(e) {
    e.preventDefault();
    const title = productTitle.value;
    const quantity = Math.round(productQuantity.value);
    const category = categoryList.dataset.id;
    if (!title) {
      productTitle.focus();
      return;
    } else if (!quantity || quantity <= 0) {
      productQuantity.focus();
      return;
    } else if (!category || category === "null") return;

    if (this.EditId) {
      Storage.saveProducts({ title, quantity, category, id: this.EditId });
    } else {
      Storage.saveProducts({ title, quantity, category });
    }

    Toggle.exitProduct();
    this.sortProduct();
  }

  resetProductForm() {
    productTitle.value = "";
    productQuantity.value = "";
    this.EditId = null;
    addBtn.innerText = "اضافه کردن";
    productFromTitle.innerText = "محصول جدید";
  }

  createProductsList() {
    let result = "";
    this.allProducts.forEach((item) => {
      const date = new Date(item.updated).toLocaleDateString("fa-IR");
      const category = Storage.getAllCategories().find(
        (c) => c.id === parseInt(item.category)
      );
      result += `
      <ul x-data="{ open: false }" 
      class="grid grid-cols-12 items-center gap-x-2 w-full bg-white py-4 px-2 rounded-md shadow-md text-sm mb-2"
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
      <li @click="open = !open" @click.outside="open = false" class="col-span-2 relative cursor-pointer">
       <div>
       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
      </div>
      <div x-show="open" class="bg-white z-10 absolute flex flex-col -left-2 top-8 rounded-md border border-gray-200 overflow-hidden">
      <button
      data-id=${item.id}
        class="delete-product hover:bg-gray-50 py-2.5 pl-32 px-2 text-sm text-red-500 border-b border-gray-200 flex items-center justify-start gap-x-1"
      >
      <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
      </svg>
      <span>حذف</span>
      </button>
      <button
      data-id=${item.id}
        class="edit-product hover:bg-gray-50 py-2.5 pl-32 px-2 text-sm flex items-center justify-start gap-x-1"
      >
      <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg> 
    <span>ویرایش</span>
      </button> 
      </div>
      </li>
    </ul>
      `;
    });
    productList.innerHTML = result;
    this.deleteProduct();
    this.editProduct();
  }

  searchProduct(value) {
    const filtered = Storage.getAllProducts().filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    this.sortProduct(filtered);
  }

  sortProduct(value = this.sorted, products = Storage.getAllProducts()) {
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
    this.allProducts = Storage.getAllProducts();
    this.createProductsList();
    this.sorted = value;
  }

  deleteProduct() {
    const deleteBtns = [...document.querySelectorAll(".delete-product")];
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        Storage.deleteProducts(e.currentTarget.dataset.id);
        this.sortProduct();
      });
    });
  }

  editProduct() {
    const editBtns = [...document.querySelectorAll(".edit-product")];
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const selected = this.allProducts.find(
          (item) => item.id === parseInt(id)
        );
        productTitle.value = selected.title;
        productQuantity.value = selected.quantity;
        categoryList.dataset.id = selected.category;
        this.EditId = id;
        addBtn.innerText = "ویرایش کردن";
        productFromTitle.innerText = "ویرایش محصول";
        CategoryView.checkedOption();
        Toggle.showProduct();
      });
    });
  }
}

export default new ProductView();
