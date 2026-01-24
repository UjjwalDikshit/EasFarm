// src/store/slices/homeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {fetchHomeBannerAndCards} from '../asyncThunk.js'

const initialState = {
  banner: [],
  cards: [],
  loading: false,
  error: null,
  fetched: false,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeData: (state) => {
      state.banner = [];
      state.cards = [];
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
        // console.log(action.payload.banner);
        state.loading = false;
        state.banner = action.payload.banners;
        state.cards = action.payload.categories;
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