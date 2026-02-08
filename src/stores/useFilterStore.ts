import { create } from "zustand";

export type FilterState = {
  minPrice: number | null;
  maxPrice: number | null;
  selectedCategory: string;
  searchQuery: string;
};

export type FilterActions = {
  setMinPrice: (price: number | null) => void;
  setMaxPrice: (price: number | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
};

const initialState: FilterState = {
  minPrice: null,
  maxPrice: null,
  selectedCategory: "Todo",
  searchQuery: "",
};
export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setMinPrice: (price) => set({ minPrice: price }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set({ ...initialState }),
}));