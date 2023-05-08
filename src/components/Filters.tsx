import { useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";

import classes from "./Filters.module.css";
import FilterConfig from "../types/FiltersConfig";
import { useForm, Controller } from "react-hook-form";

function Filters({
  filtersConfig,
  onFiltersUpdate,
}: {
  filtersConfig: FilterConfig;
  onFiltersUpdate: (data: { [x: string]: any }) => void;
}) {
  const {
    watch,
    reset,
    control,
    formState: { isDirty },
  } = useForm();
  const defaultValues = filtersConfig.reduce(
    (obj, item) => Object.assign(obj, { [item.name]: item.initialValue }),
    {}
  );

  useEffect(() => {
    const subscription = watch((data) => {
      if (Object.keys(data).length) {
        onFiltersUpdate(data);
      } else {
        onFiltersUpdate(defaultValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onFiltersUpdate, defaultValues]);

  const clearFilters = () => {
    reset();
  };

  return (
    <div className={classes.filters}>
      {filtersConfig.map((filter) => {
        switch (filter.type) {
          case "text":
            return (
              <Controller
                key={filter.name}
                defaultValue={filter.initialValue}
                name={filter.name}
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      label={filter.label}
                      variant='standard'
                    />
                  );
                }}
              />
            );
          case "select":
            return (
              <FormControl
                key={filter.name}
                variant='standard'
                sx={{ minWidth: 100 }}
              >
                <InputLabel>{filter.label}</InputLabel>
                <Controller
                  name={filter.name}
                  defaultValue={filter.initialValue}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select {...field}>
                        {filter.values.map((value) =>
                          value.length ? (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ) : (
                            <MenuItem key={value} value={value}>
                              {"All"}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    );
                  }}
                />
              </FormControl>
            );
          default:
            return 0;
        }
      })}
      {isDirty && <Button onClick={clearFilters}>Clear filters</Button>}
    </div>
  );
}

export default Filters;
