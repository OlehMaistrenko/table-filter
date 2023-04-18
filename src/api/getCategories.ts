export default function getCategories() {
  return fetch(`https://dummyjson.com/products/categories`)
    .then((res) => res.json())
    .then((data) => data);
}
