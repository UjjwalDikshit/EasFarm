// features/bannerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    isVisible: true,
    slides: [
      { id: 1, image: "banner1.jpg", title: "Welcome", subtitle: "Peace & Wellness for All" },
      { id: 2, image: "banner2.jpg", title: "Sanatani Living", subtitle: "Balance of Body, Mind & Soul" },
    ],
    currentSlide: 0,
  },
  reducers: {
    nextSlide: (state) => {
      state.currentSlide = (state.currentSlide + 1) % state.slides.length;
    },
    prevSlide: (state) => {
      state.currentSlide =
        (state.currentSlide - 1 + state.slides.length) % state.slides.length;
    },
  },
});

export const { nextSlide, prevSlide } = bannerSlice.actions;
export default bannerSlice.reducer;
