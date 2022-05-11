import Storage from "./Storage.js";

const productList = document.querySelector("#productList");
const productTitle = document.querySelector("#product-title");
const productQuantity = document.querySelector("#product-quantity");
const addBtn = document.querySelector("#product-add");

class ProductView {
  constructor() {
    addBtn.addEventListener("click", (e) => this.addNewProduct(e));
    this.allProducts = Storage.getAllProducts();
  }

  addNewProduct(e) {
    e.preventDefault();
    const title = productTitle.value;
    const quantity = productQuantity.value;
    const category = document.querySelector("#categoryList").value;
    if (!category || !title || !quantity) return;
    Storage.saveProducts({ title, quantity, category });
    this.allProducts = Storage.getAllProducts();
    this.createProductsList();
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
}

export default new ProductView();
