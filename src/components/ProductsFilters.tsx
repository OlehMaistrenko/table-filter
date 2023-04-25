import { useState, useContext, useEffect, useCallback } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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
  const handleRowsChange = async (event: SelectChangeEvent) => {
    setFiltersState((prev) => {
      const rowsPerPage = parseInt(event.target.value);
      const maxPage = Math.ceil(productsCount / rowsPerPage);
      const page = maxPage < prev.page ? maxPage : prev.page;
      return { ...prev, rowsPerPage, page };
    });
  };
  const handleClearFilters = () => {
    setFiltersState(defaultFiltersState);
    setSearchInputValue("");
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setFiltersState((prev) => {
      return { ...prev, category: event.target.value };
    });
  };
  const areFiltersDefault = () => {
    const keys = Object.keys(filtersState) as Array<keyof typeof filtersState>;
    return keys.reduce(
      (acc, key) => acc && filtersState[key] === defaultFiltersState[key],
      true
    );
  };
  useEffect(() => {
    setFiltersState((prev) => {
      return { ...prev, searchVal: debouncedSearchInputValue };
    });
  }, [debouncedSearchInputValue, setFiltersState]);
  useEffect(() => {
    (async () => {
      toggleLoading();
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
      {!areFiltersDefault() && (
        <Button onClick={handleClearFilters}>Clear filters</Button>
      )}
    </div>
  );
}

export default ProductsFilters;
