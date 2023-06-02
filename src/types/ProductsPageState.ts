import FiltersState from "./FiltersState";
import PaginationState from "./PaginationState";

export default interface State {
  paginationState: PaginationState;
  filtersState: FiltersState;
}
