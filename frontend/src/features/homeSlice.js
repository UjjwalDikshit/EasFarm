import { createSlice } from "@reduxjs/toolkit";
import { fetchHomeBannerAndCards } from "../asyncThunk.js";

const initialState = {
  home: {
    banners: [],
    categories: [],
  },
  loading: false,
  error: null,
  fetched: false,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,

  reducers: {
    clearHomeData: (state) => {
      state.home = { banners: [], categories: [] };
      state.fetched = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeBannerAndCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHomeBannerAndCards.fulfilled, (state, action) => {
        state.loading = false;

        //  MATCH BACKEND STRUCTURE
        state.home = action.payload.home;

        state.fetched = true;
      })

      .addCase(fetchHomeBannerAndCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHomeData } = homeSlice.actions;
export default homeSlice.reducer;