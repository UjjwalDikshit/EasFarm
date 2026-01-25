import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

// Async thunks
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (mobileNumber, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/sendotp', { mobileNumber });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyOtpAndLogin = createAsyncThunk(
  'auth/verifyOtpAndLogin',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const registerFarmer = createAsyncThunk(
  'auth/registerFarmer',
  async (farmerData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/signup', farmerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('farmerToken'),
    isLoading: false,
    error: null,
    success: null,
    otpSent: false,
    countdown: 0,
    registrationStep: 1, // 1: Personal, 2: Address, 3: Location & Consent
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('farmerToken');
      localStorage.removeItem('farmerData');
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
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpSent = true;
        state.countdown = 60;
        state.success = 'OTP sent to your registered email address';
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send OTP';
      })
      // Verify OTP and Login
      .addCase(verifyOtpAndLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpAndLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.farmer;
        state.token = action.payload.token;
        state.success = 'Login successful!';
        state.otpSent = false;
        state.countdown = 0;
        
        localStorage.setItem('farmerToken', action.payload.token);
        localStorage.setItem('farmerData', JSON.stringify(action.payload.farmer));
      })
      .addCase(verifyOtpAndLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register Farmer
      .addCase(registerFarmer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerFarmer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload?.message || 'Registration successful! Redirecting to login...';
        state.registrationStep = 1;
      })
      .addCase(registerFarmer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
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
  resetRegistrationState 
} = authSlice.actions;
export default authSlice.reducer;