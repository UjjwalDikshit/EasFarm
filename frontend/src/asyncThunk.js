

import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const fetchHomeBannerAndCards = createAsyncThunk(
    "home/fetchHomeBannerAndCards",
    async () => {
        try{
            const res = await axiosClient.get('/home');
            // if (!res.ok) 
            //      throw new Error(`HTTP error! status: ${res.status}`);
            // console.log(res.data);
            console.log(res);
            return res;
        }catch (error) {
            return isRejectedWithValue(error.response.data);
        }
    }
);

export const fetchMachineAndTools = createAsyncThunk(
    "machine/fetchMachineAndTools",
    async({ page = 1, limit = 10, category, sort, order, search })=>{
        try{
            const params = { page, limit, category, sort, order, search };
            const res = await axiosClient.get('/service/get-all-tools',{params});
            return res.data;
        }catch(error){
            return isRejectedWithValue(error.response.data);
        }
    }
);