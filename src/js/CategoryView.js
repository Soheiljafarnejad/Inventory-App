import ProductView from "./ProductView.js";
import Storage from "./Storage.js";
import Toggle from "./Toggle.js";
const categoryFromTitle = document.querySelector("#categoryFrom-title");
const categoryList = document.querySelector("#categoryList");
const categoryTitle = document.querySelector("#category-title");
const categoryDescription = document.querySelector("#category-description");
const addBtn = document.querySelector("#category-add");
const categoryOptionTitle = document.querySelector("#categoryOptionTitle");

class CategoryView {
  constructor() {
    addBtn.addEventListener("click", (e) => this.addNewCategory(e));
    this.allCategories = Storage.getAllCategories();
    this.EditId = null;
    this.checkedOption();
  }
  addNewCategory(e) {
    e.preventDefault();
    const title = categoryTitle.value;
    const description = categoryDescription.value;
    if (!title) {
      categoryTitle.focus();
      return;
    }
    if (this.EditId) {
      Storage.saveCategories({ title, description, id: this.EditId });
      ProductView.sortProduct();
    } else Storage.saveCategories({ title, description });

    Toggle.exitCategory();
    this.allCategories = Storage.getAllCategories();
    this.checkedOption();
    this.creatCategoryList();
    this.resetCategoryForm();
  }

  resetCategoryForm() {
    categoryTitle.value = "";
    categoryDescription.value = "";
    this.EditId = null;
    addBtn.innerText = "اضافه کردن";
    categoryFromTitle.innerText = "دسته بندی جدید";
  }

  creatCategoryList() {
    let result = "";
    this.allCategories.forEach((item) => {
      result += `
      <li
      @click="open = false"
      class="categoryOptions w-full p-2 cursor-pointer hover:bg-gray-50 border border-t-0 border-gray-200 flex items-center justify-between" 
      data-id=${item.id}>
      <p>${item.title}</p>
      <div class="flex items-center gap-x-2">
      <span data-id=${item.id} class="edit-category">  
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
    </span>
    <span data-id=${item.id} class="delete-category">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 stroke-red-500"
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
    </span>
  </div>
      </li>`;
    });
    categoryList.innerHTML = result;
    this.selectCategory();
    this.deleteCategory();
    this.editCategory();
  }

  selectCategory() {
    const allOptions = [...document.querySelectorAll(".categoryOptions")];
    allOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        categoryList.dataset.id = id;
        this.checkedOption();
      });
    });
  }
  checkedOption() {
    const id = categoryList.dataset.id;
    const selected = this.allCategories.find(
      (item) => item.id === parseInt(id)
    );
    if (selected) {
      categoryOptionTitle.innerText = selected.title;
    } else {
      categoryOptionTitle.innerText = "انتخاب دسته بندی";
    }
  }
  deleteCategory() {
    const deleteBtns = document.querySelectorAll(".delete-category");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        Storage.deleteCategoryProducts(id);
        Storage.deleteCategories(id);
        categoryList.dataset.id = null;
        this.checkedOption();
        ProductView.sortProduct();
        this.allCategories = Storage.getAllCategories();
        this.creatCategoryList();
      });
    });
  }

  editCategory() {
    const editBtns = document.querySelectorAll(".edit-category");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        const selected = this.allCategories.find(
          (item) => item.id === parseInt(id)
        );
        this.EditId = id;
        categoryTitle.value = selected.title;
        categoryDescription.value = selected.description;
        Toggle.showCategory();
        categoryFromTitle.innerText = "ویرایش دسته بندی";
        addBtn.innerText = "ویرایش کردن";
      });
    });
  }
}

export default new CategoryView();
