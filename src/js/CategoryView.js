import Storage from "./Storage.js";
import Toggle from "./Toggle.js";

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
    if (!title) {
      categoryTitle.focus();
      return;
    }
    Storage.saveCategories({ title, description });
    Toggle.exitCategory();
    this.allCategories = Storage.getAllCategories();
    this.creatCategoryList();
    categoryList.focus();
    categoryTitle.value = "";
    categoryDescription.value = "";
  }

  creatCategoryList() {
    let result = `<option value="">انتخاب دسته بندی</option>`;
    this.allCategories.forEach((item) => {
      result += `<option value=${item.id}>${item.title}</option>`;
    });
    categoryList.innerHTML = result;
  }
}

export default new CategoryView();
