// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosClient from '../utils/axiosClient';

// // Async thunks
// export const sendOtp = createAsyncThunk(
//   'auth/sendOtp',
//   async (mobileNumber, { rejectWithValue }) => {
//     try {
//       const response = await axiosClient.post('/user/sendotp', { mobileNumber });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchUser = createAsyncThunk(
//   "auth/fetchUser",
//   async (_,{rejectWithValue})=>{
//     try{
//       const res = await axiosClient.get('/user/me',{
//         withCredentials:true,
//       })
//       return res.data; // backend is sending {loggedIn": true,farmer}
//     }catch(err){
//       return rejectWithValue(err.response?.data?.data?.message || "Auth failed");
//     }
//   }
// )

// // 🔥 2. Initial State
// const InitialStateForUserInfo = {
//   user: null,
//   isAuthenticated: false,
//   authLoading: true,   // important to prevent flicker
//   error: null,
// };

// export const verifyOtpAndLogin = createAsyncThunk(
//   'auth/verifyOtpAndLogin',
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const response = await axiosClient.post('/user/login', loginData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const registerFarmer = createAsyncThunk(
//   'auth/registerFarmer',
//   async (farmerData, { rejectWithValue }) => {
//     try {
//       const response = await axiosClient.post('/user/signup', farmerData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('farmerToken'),
//     isLoading: false,
//     error: null,
//     success: null,
//     otpSent: false,
//     countdown: 0,
//     registrationStep: 1, // 1: Personal, 2: Address, 3: Location & Consent
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = null;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('farmerToken');
//       localStorage.removeItem('farmerData');
//     },
//     setCountdown: (state, action) => {
//       state.countdown = action.payload;
//     },
//     resetOtpState: (state) => {
//       state.otpSent = false;
//       state.countdown = 0;
//     },
//     setRegistrationStep: (state, action) => {
//       state.registrationStep = action.payload;
//     },
//     resetRegistrationState: (state) => {
//       state.registrationStep = 1;
//       state.error = null;
//       state.success = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Send OTP
//       .addCase(sendOtp.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(sendOtp.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.otpSent = true;
//         state.countdown = 60;
//         state.success = 'OTP sent to your registered email address';
//       })
//       .addCase(sendOtp.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to send OTP';
//       })
//       // Verify OTP and Login
//       .addCase(verifyOtpAndLogin.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.farmer;
//         state.token = action.payload.token;
//         state.success = 'Login successful!';
//         state.otpSent = false;
//         state.countdown = 0;

//         localStorage.setItem('farmerToken', action.payload.token);
//         localStorage.setItem('farmerData', JSON.stringify(action.payload.farmer));
//       })
//       .addCase(verifyOtpAndLogin.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Login failed';
//       })
//       // Register Farmer
//       .addCase(registerFarmer.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(registerFarmer.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.success = action.payload?.message || 'Registration successful! Redirecting to login...';
//         state.registrationStep = 1;
//       })
//       .addCase(registerFarmer.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Registration failed';
//       });
//   },
// });

// export const {
//   clearError,
//   clearSuccess,
//   logout,
//   setCountdown,
//   resetOtpState,
//   setRegistrationStep,
//   resetRegistrationState
// } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

/* ============================
   ASYNC THUNKS
============================ */

// 🔹 Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (mobileNumber, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/sendotp", {
        mobileNumber,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
  },
);

// 🔹 Verify OTP & Login
export const verifyOtpAndLogin = createAsyncThunk(
  "auth/verifyOtpAndLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", loginData, {
        withCredentials: true, // important for cookies
      });
      console.log(response);
      const res = await axiosClient.get("/user/me");
      console.log(res.data);
      return res.data; // { farmer }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

// 🔹 Register Farmer
export const registerFarmer = createAsyncThunk(
  "auth/registerFarmer",
  async (farmerData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/signup", farmerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  },
);

// 🔹 Fetch Logged-In User (/me)
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/user/me", {
        withCredentials: true,
      });

      // backend sends: { loggedIn: true, farmer }
      return res.data.farmer;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  },
);

/* ============================
   INITIAL STATE
============================ */

const initialState = {
  user: null,
  isAuthenticated: false,
  authLoading: true, // for app startup check (/me)
  isLoading: false, // for login/register actions
  error: null,
  success: null,
  otpSent: false,
  countdown: 0,
  registrationStep: 1,
};

/* ============================
   SLICE
============================ */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSuccess: (state) => {
      state.success = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },

    resetOtpState: (state) => {
      state.otpSent = false;
      state.countdown = 0;
    },

    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },

    resetRegistrationState: (state) => {
      state.registrationStep = 1;
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ============================
         SEND OTP
      ============================ */
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
        state.countdown = 60;
        state.success = "OTP sent successfully";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      /* ============================
         VERIFY OTP LOGIN
      ============================ */
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.farmer;
        state.isAuthenticated = true;
        state.success = "Login successful!";
        state.otpSent = false;
        state.countdown = 0;
      })
      .addCase(verifyOtpAndLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || action.payload;
      })

      /* ============================
         REGISTER
      ============================ */
      .addCase(registerFarmer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerFarmer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload?.message || "Registration successful!";
        state.registrationStep = 1;
      })
      .addCase(registerFarmer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.payload;
      })

      /* ============================
         FETCH USER (/me)
      ============================ */
      .addCase(fetchUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.authLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  logout,
  setCountdown,
  resetOtpState,
  setRegistrationStep,
  resetRegistrationState,
} = authSlice.actions;

export default authSlice.reducer;
