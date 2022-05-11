import Storage from "./Storage.js";

const categoryList = document.querySelector("#categoryList");
const categoryTitle = document.querySelector("#category-title");
const categoryDescription = document.querySelector("#category-description");
const addBtn = document.querySelector("#category-add");

class CategoryView {
  constructor() {
    addBtn.addEventListener("click", (e) => this.addNewCategory(e));
    this.allCategories = Storage.getAllCategories();
  }
  addNewCategory(e) {
    e.preventDefault();
    const title = categoryTitle.value;
    const description = categoryDescription.value;
    if (!title || !description) return;
    Storage.saveCategories({ title, description });
    this.allCategories = Storage.getAllCategories();
    this.creatCategoryList();
    categoryTitle.value = "";
    categoryDescription.value = "";
  }

  creatCategoryList() {
    let result = `<option>select category</option>`;
    this.allCategories.forEach((item) => {
      result += `<option value=${item.id}>${item.title}</option>`;
    });
    categoryList.innerHTML = result;
  }
}

export default new CategoryView();
