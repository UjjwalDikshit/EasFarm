import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem("theme") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode =
        state.mode === "light"
          ? "dark"
          : state.mode === "dark"
          ? "weather"
          : "light";

      // Apply to DOM
      document.documentElement.setAttribute("data-theme", state.mode);

      // Persist
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;