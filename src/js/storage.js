export default class storage {
  static getAllCategories() {
    const allCategories = JSON.parse(localStorage.getItem("category")) || [];

    const sortCategories = allCategories.sort((a, b) =>
      new Date(a.createdAt) > new Date(b.createdAt) ? -1 : +1
    );
    return sortCategories;
  }

  static saveCategories(categoryToSave) {
    const allCategory = storage.getAllCategories();
    const selectedItem = allCategory.find(
      (item) => item.id === categoryToSave.id
    );
    if (selectedItem) {
      selectedItem.title = categoryToSave.title;
      selectedItem.description = categoryToSave.description;
      selectedItem.createdAt = new Date().toISOString();
    } else {
      categoryToSave.id = new Date().getTime();
      categoryToSave.createdAt = new Date().toISOString();
      allCategory.push(categoryToSave);
    }

    localStorage.setItem("category", JSON.stringify(allCategory));
  }
}
