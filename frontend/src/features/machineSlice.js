// // features/cardsSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import {fetchMachineAndTools} from "../asyncThunk";


// const machineSlice = createSlice({
//   name: "machine",
//   initialState:{
//     loading:false,
//     machines:[],
//     error:null,
//     fetched :false,
//   },
//   reducers: {
//     addTools: (state, action) => {
//       state.machines.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//       builder
//         .addCase(fetchMachineAndTools.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(fetchMachineAndTools.fulfilled, (state, action) => {
//           state.loading = false;
//           const {page} = action.payload;
//           if(page != 1) state.machines = {...state.machines,...action.payload}
//           else state.machines = action.payload;
//           state.fetched = true;
//         })
//         .addCase(fetchMachineAndTools.rejected, (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         });
//     },
// });

// export const { addTools } = machineSlice.actions;
// export default machineSlice.reducer;
