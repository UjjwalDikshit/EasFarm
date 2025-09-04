import {createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name:"theme",
    initialState:"light",
    reducers:{
        toggleTheme: (state)=>(state==="light" ?"dark":"light"),
        setTheme:(state,action)=>state = action.payload,
    },
})

export const {toggleTheme,setTheme} = themeSlice.actions;
export default themeSlice.reducer;

// https://aistudio.google.com/prompts/16OjMaBDJzCBQtfEuPDHGBixjDGf-maHi