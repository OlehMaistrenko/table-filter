import { useState, useContext, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";
import FiltersState from "../types/FiltersState";
import { AppContext } from "../App";
import getCategories from "../api/getCategories";
import classes from "./ProductsFilters.module.css";
import useDebounce from "../hooks/useDebounce";

function ProductsFilters({
  defaultFiltersState,
  productsCount,
  filtersState,
  setFiltersState,
}: {
  defaultFiltersState: FiltersState;
  productsCount: number;
  filtersState: FiltersState;
  setFiltersState: React.Dispatch<React.SetStateAction<FiltersState>>;
}) {
  const { toggleLoading } = useContext(AppContext);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const debouncedSearchInputValue = useDebounce<string>(searchInputValue, 1000);
  const [category, setCategory] = useState<string>(filtersState.category);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    filtersState.rowsPerPage
  );

  const areFiltersDefault = () => {
    const keys = Object.keys(filtersState) as Array<keyof typeof filtersState>;
    return keys.reduce(
      (acc, key) => acc && filtersState[key] === defaultFiltersState[key],
      true
    );
  };

  const handleClearFilters = () => {
    setFiltersState(defaultFiltersState);
    setSearchInputValue("");
  };
  useEffect(() => {
    setFiltersState((prev) => {
      const maxPage = Math.ceil(productsCount / rowsPerPage) || 1;
      const page = maxPage < prev.page ? maxPage : prev.page;
      return {
        ...prev,
        category,
        page,
        rowsPerPage,
        searchVal: debouncedSearchInputValue,
      };
    });
  }, [debouncedSearchInputValue, category, rowsPerPage, setFiltersState]);

  useEffect(() => {
    (async () => {
      toggleLoading();
      console.log("initial");

      const data = await getCategories();
      setCategories(data);
      toggleLoading();
    })();
  }, [toggleLoading]);
  return (
    <div className={classes.productsFilters}>
      <TextField
        label='Search'
        value={searchInputValue}
        onChange={(e) => {
          setSearchInputValue(e.currentTarget.value);
        }}
        variant='standard'
      />
      {categories.length && (
        <FormControl variant='standard' sx={{ minWidth: 100 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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
          value={rowsPerPage.toString()}
          onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
      {!areFiltersDefault() && (
        <Button onClick={handleClearFilters}>Clear filters</Button>
      )}
    </div>
  );
}

export default ProductsFilters;
