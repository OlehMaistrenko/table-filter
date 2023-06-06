import { useEffect, useState, useContext, useReducer } from "react";
import FiltersState from "../types/FiltersState";
import PaginationState from "../types/PaginationState";
import ProductsPageState from "../types/ProductsPageState";
import Product from "../types/Product";
// import Pagination from "@mui/material/Pagination";
import Pagination from "./Pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { AppContext } from "../App";
import getCategories from "../api/getCategories";
import getProducts from "../api/getProducts";
import Filters from "./Filters";
import FilterConfig from "../types/FiltersConfig";
import useDebounce from "../hooks/useDebounce";
import UsePagination from "./Pagination/UsePagination";

type Action =
  | { type: "UPDATE_PAGE"; payload: Partial<PaginationState> }
  | {
      type: "UPDATE_FILTER";
      payload: {
        paginationState: Partial<PaginationState>;
        filtersState: Partial<FiltersState>;
      };
    };

const initialProductsPageState: ProductsPageState = {
  filtersState: { category: "", searchVal: "" },
  paginationState: { page: 1, rowsPerPage: 10 },
};
const reducer = (
  ProductsPageState: ProductsPageState,
  action: Action
): ProductsPageState => {
  switch (action.type) {
    case "UPDATE_PAGE":
      return {
        filtersState: ProductsPageState.filtersState,
        paginationState: {
          ...ProductsPageState.paginationState,
          ...action.payload,
        },
      };
    case "UPDATE_FILTER":
      return {
        filtersState: {
          ...ProductsPageState.filtersState,
          ...action.payload.filtersState,
        },
        paginationState: {
          ...ProductsPageState.paginationState,
          ...action.payload.paginationState,
        },
      };
    default:
      return ProductsPageState;
  }
};

const constantFiltersConfig: FilterConfig = [
  {
    type: "text",
    label: "Search",
    name: "searchVal",
    initialValue: "",
  },
];
export default function Products() {
  const [filtersState, setFiltersState] = useState<FiltersState>(
    initialProductsPageState.filtersState
  );
  const debouncedFiltersState = useDebounce(filtersState, 700);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const { toggleLoading } = useContext(AppContext);
  const handleFiltersUpdate = (data: { [x: string]: any }) => {
    setFiltersState((prev) => ({ ...prev, ...data }));
  };
  const [filtersConfig, setFiltersConfig] = useState<FilterConfig>(
    constantFiltersConfig
  );

  const [productsPageState, dispatchPoductsPageState] = useReducer(
    reducer,
    initialProductsPageState
  );

  const handlePageChange = (value: number) => {
    dispatchPoductsPageState({ type: "UPDATE_PAGE", payload: { page: value } });
  };
  const handlePageChangeHook = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatchPoductsPageState({ type: "UPDATE_PAGE", payload: { page } });
  };

  useEffect(() => {
    (async () => {
      toggleLoading();
      const data = await getProducts(productsPageState);
      setProducts(data.products);
      setProductsCount(data.total);
      toggleLoading();
    })();
  }, [productsPageState, toggleLoading]);

  useEffect(() => {
    dispatchPoductsPageState({
      type: "UPDATE_FILTER",
      payload: {
        filtersState: debouncedFiltersState,
        paginationState: { page: 1 },
      },
    });
  }, [debouncedFiltersState]);

  useEffect(() => {
    (async () => {
      const categories = await getCategories();
      setFiltersConfig([
        ...constantFiltersConfig,
        {
          type: "select",
          label: "Category",
          name: "category",
          initialValue: "",
          values: ["", ...categories],
        },
      ]);
    })();
  }, []);

  return (
    <>
      <Filters
        filtersConfig={filtersConfig}
        onFiltersUpdate={handleFiltersUpdate}
      ></Filters>

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

      <div className='products__bottom'>
        <Filters
          filtersConfig={[
            {
              type: "select",
              label: "Rows per page",
              name: "rowsPerPage",
              initialValue: "10",
              values: ["10", "20", "30"],
            },
          ]}
          onFiltersUpdate={(data) => {
            const payload: Partial<PaginationState> = data;
            dispatchPoductsPageState({ type: "UPDATE_PAGE", payload });
          }}
        ></Filters>
        <Pagination
          count={Math.ceil(
            productsCount / productsPageState.paginationState.rowsPerPage
          )}
          page={productsPageState.paginationState.page}
          onChange={handlePageChange}
        />
        <UsePagination
          count={Math.ceil(
            productsCount / productsPageState.paginationState.rowsPerPage
          )}
          page={productsPageState.paginationState.page}
          onChange={handlePageChangeHook}
        ></UsePagination>
      </div>
    </>
  );
}
