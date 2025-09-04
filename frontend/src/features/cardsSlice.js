// features/cardsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: [
    { id: 1, title: "Wellness", description: "Yoga, Ayurveda, Meditation", icon: "🌿", link: "/wellness" },
    { id: 2, title: "Community", description: "Connect with Global Hindus", icon: "🌍", link: "/community" },
    { id: 3, title: "Knowledge", description: "Vedic Wisdom & Practices", icon: "📖", link: "/knowledge" },
  ],
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload);
    },
    removeCard: (state, action) => {
      return state.filter((card) => card.id !== action.payload);
    },
  },
});

export const { addCard, removeCard } = cardsSlice.actions;
export default cardsSlice.reducer;
