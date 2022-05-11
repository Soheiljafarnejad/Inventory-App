export default class Storage {
  static getAllCategories() {
    const allCategories = JSON.parse(localStorage.getItem("category")) || [];

    const sortCategories = allCategories.sort((a, b) =>
      new Date(a.updated) > new Date(b.updated) ? -1 : +1
    );
    return sortCategories;
  }

  static saveCategories(categoryToSave) {
    const allCategory = Storage.getAllCategories();
    const selectedItem = allCategory.find(
      (item) => item.id === categoryToSave.id
    );
    if (selectedItem) {
      selectedItem.title = categoryToSave.title;
      selectedItem.description = categoryToSave.description;
      selectedItem.updated = new Date().toISOString();
    } else {
      categoryToSave.id = new Date().getTime();
      categoryToSave.updated = new Date().toISOString();
      allCategory.push(categoryToSave);
    }

    localStorage.setItem("category", JSON.stringify(allCategory));
  }

  static getAllProducts() {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const sortProducts = allProducts.sort((a, b) =>
      new Date(a.updated) > new Date(b.updated) ? -1 : +1
    );
    return sortProducts;
  }

  static saveProducts(productsToSave) {
    const allProducts = Storage.getAllProducts();
    const selectedItem = allProducts.find(
      (item) => item.id === productsToSave.id
    );
    if (selectedItem) {
      selectedItem.title = productsToSave.title;
      selectedItem.quantity = productsToSave.quantity;
      selectedItem.updated = new Date().toISOString();
    } else {
      productsToSave.id = new Date().getTime();
      productsToSave.updated = new Date().toISOString();
      allProducts.push(productsToSave);
    }
    localStorage.setItem("products", JSON.stringify(allProducts));
  }
}
