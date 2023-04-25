import { useEffect, useState, useContext } from "react";
import FiltersState from "../types/FiltersState";
import Product from "../types/Product";
import Pagination from "@mui/material/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { AppContext } from "../App";
import getProducts from "../api/getProducts";
import ProductsFilters from "./ProductsFilters";

const defaultFiltersState: FiltersState = {
  page: 1,
  rowsPerPage: 10,
  category: "",
  searchVal: "",
};

export default function Products() {
  const [filtersState, setFiltersState] =
    useState<FiltersState>(defaultFiltersState);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);

  const { toggleLoading } = useContext(AppContext);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFiltersState((prev) => {
      return { ...prev, page: value };
    });
  };

  useEffect(() => {
    (async () => {
      toggleLoading();
      const data = await getProducts(filtersState);
      setProducts(data.products);
      setProductsCount(data.total);
      toggleLoading();
    })();
  }, [filtersState, toggleLoading]);

  return (
    <>
      <ProductsFilters
        defaultFiltersState={defaultFiltersState}
        productsCount={productsCount}
        filtersState={filtersState}
        setFiltersState={setFiltersState}
      />
      {products.length ? (
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Product name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount, %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell component='th' scope='row'>
                  {product.title}
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.discountPercentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div style={{ textAlign: "center", padding: "30px" }}>
          Products not found
        </div>
      )}

      {productsCount > filtersState.rowsPerPage && (
        <Pagination
          count={Math.ceil(productsCount / filtersState.rowsPerPage)}
          page={filtersState.page}
          onChange={handlePageChange}
        />
      )}
    </>
  );
}
