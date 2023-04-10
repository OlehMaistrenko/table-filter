import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  category: string;
  brand: string;
}
interface FiltersState {
  page: number;
  rowsPerPage: number;
  category: string;
}

export default function Products() {
  const [filtersState, setFiltersState] = useState<FiltersState>({
    page: 1,
    rowsPerPage: 10,
    category: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFiltersState((prev) => {
      return { ...prev, page: value };
    });
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFiltersState((prev) => {
      return { ...prev, category: event.target.value };
    });
  };
  const handleRowsChange = async (event: SelectChangeEvent) => {
    setFiltersState((prev) => {
      const rowsPerPage = parseInt(event.target.value);
      const maxPage = Math.ceil(productsCount / rowsPerPage);
      const page = maxPage < prev.page ? maxPage : prev.page;
      return { ...prev, rowsPerPage, page };
    });
  };

  useEffect(() => {
    (async () => {
      const data = await fetch(`https://dummyjson.com/products/categories`)
        .then((res) => res.json())
        .then((data) => data);
      setCategories(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetch(
        `https://dummyjson.com/products${
          filtersState.category.length
            ? `/category/${filtersState.category}`
            : ""
        }?limit=${filtersState.rowsPerPage}&skip=${
          filtersState.rowsPerPage * (filtersState.page - 1)
        }`
      )
        .then((res) => res.json())
        .then((data) => data);
      setProducts(data.products);
      setProductsCount(data.total);
    })();
  }, [filtersState]);

  return (
    <>
      {categories.length && (
        <FormControl variant='standard' sx={{ minWidth: 100 }}>
          <InputLabel>Category</InputLabel>
          <Select value={filtersState.category} onChange={handleCategoryChange}>
            <MenuItem value=''>All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControl variant='standard' sx={{ minWidth: 100 }}>
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={filtersState.rowsPerPage.toString()}
          onChange={handleRowsChange}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
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
          {products?.map((product) => (
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
      {productsCount !== 0 && (
        <Pagination
          count={Math.ceil(productsCount / filtersState.rowsPerPage)}
          page={filtersState.page}
          onChange={handlePageChange}
        />
      )}
    </>
  );
}
