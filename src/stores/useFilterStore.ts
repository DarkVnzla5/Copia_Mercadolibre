import { create }  from "zustand";

export type FilterState = {
  minPrice: number | null;
  maxPrice: number | null;
  selectedCategory: string;
};
export type SearchBarState={
  searchQuery:string;
}
export type FilterActions = {
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
};
export type SearchBarActions={
  setSearchQuery:(query:string | [])=>void;
};

const initialState: FilterState = {
  minPrice: null,
  maxPrice: null,
  selectedCategory: "Todo",
};
export const useFilterStore = create<FilterState & FilterActions>((set)=>({
  ...initialState,
  setMinPrice:(price)=>set({minPrice:price}),
  setMaxPrice:(price)=>set({maxPrice:price}),
  setSelectedCategory:(category)=>set({selectedCategory:category}),
  resetFilters:()=>set({...initialState}),
}));