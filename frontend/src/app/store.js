import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import headerReducer from "../features/headerSlice";
import bannerReducer from "../features/bannerSlice";
import cardsReducer from "../features/cardsSlice";

// import rest slices

export const store = configureStore({
    reducer:{
        theme:themeReducer,
        header:headerReducer,
        banner: bannerReducer,
        cards: cardsReducer,

        // aiBot: aiBotReducer,
        // footer: footerReducer,
        // notifications: notificationReducer,
        // loading: loadingReducer,
    }
});
// https://aistudio.google.com/prompts/16OjMaBDJzCBQtfEuPDHGBixjDGf-maHi