import ProductsPageState from "../types/ProductsPageState";
import Product from "../types/Product";
export default function getProducts({
  filtersState,
  paginationState,
}: ProductsPageState) {
  return fetch(
    `https://dummyjson.com/products${
      filtersState.category.length ? `/category/${filtersState.category}` : ""
    }?limit=${paginationState.rowsPerPage}&skip=${
      paginationState.rowsPerPage * (paginationState.page - 1)
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      if (filtersState.searchVal.length) {
        const products = data.products.filter((item: Product) =>
          item.title
            .toLowerCase()
            .includes(filtersState.searchVal.toLowerCase())
        );
        const total = products.lenght;
        return { ...data, products, total };
      } else {
        return data;
      }
    });
}
