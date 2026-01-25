// ✅ Import core redux toolkit + persist tools
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default: localStorage for web

// ✅ Import all your slice reducers
import themeReducer from "../features/themeSlice";
import headerReducer from "../features/headerSlice";
import bannerReducer from "../features/bannerSlice";
import cardsReducer from "../features/cardsSlice";
import homeReducer from "../features/homeSlice";
import authReducer from "../features/authSlice";

// ==========================
// Persist Config
// ==========================
// This tells redux-persist how to store state
const persistConfig = {
  key: "root", // key in localStorage (all persisted reducers will be stored here)
  storage,     // storage engine (here, localStorage)
};

// ==========================
// Wrap reducers you want to persist
// ==========================
// Example: persisting theme + banner slices
const persistedThemeReducer = persistReducer(persistConfig, themeReducer);
// const persistedBannerReducer = persistReducer(persistConfig, bannerReducer);

// ==========================
// Create store
// ==========================
export const store = configureStore({
  reducer: {
    // ✅ Reducers that will persist across refresh
    theme: persistedThemeReducer,   // <- persisted (saves theme in localStorage)
   // banner: persistedBannerReducer,  <- persisted (saves banner in localStorage)

    // ✅ Reducers that reset on refresh (not persisted)
    header: headerReducer,
    auth: authReducer,
    cards: cardsReducer,
    home: homeReducer,
    banner: bannerReducer,
    // Add more slices (aiBot, footer, etc.) here later
  },
  // ✅ (Optional) You can customize middleware here if needed
});

// ==========================
// Persistor
// ==========================
// Persistor is used inside <PersistGate> in App.jsx
// It controls rehydration (loading saved state from localStorage into redux store)
export const persistor = persistStore(store);























// https://aistudio.google.com/prompts/16OjMaBDJzCBQtfEuPDHGBixjDGf-maHi


// method to persist data even after referesh is 
// either store in localStorage / sessinStorage, Library:redux-persist
// On refresh → Redux store resets (lost).
// To keep data → use localStorage or redux-persist.
// For things like theme toggle, auth tokens, user settings, etc., persistence is highly recommended.