import {createSlice } from '@reduxjs/toolkit';
// try to create functionality which detecte and change auto theme


const initialState = {
  mode: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;


// https://aistudio.google.com/prompts/16OjMaBDJzCBQtfEuPDHGBixjDGf-maHi