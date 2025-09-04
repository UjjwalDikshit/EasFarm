import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name:"header",
    initialState:{
        isVisible:true,
        menuItems:[
            { label: "Home", link: "/" },
            { label: "About", link: "/about" },
            { label: "Services", link: "/services" },
            { label: "Contact", link: "/contact" },
        ],
        activeMenu : "Home",
    },
    reducers:{
        setActiveMenu:(state, action)=>{
            state.activeMenu = action.payload;
        },
        toggleHeader:(state)=>{
            state.isVisible = !state.isVisible;
        },
    },
});

export const {setActiveMenu,toggleHeader} = headerSlice.actions;
export default headerSlice.reducer;