import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import './FarmerLogin.css';
import validator from 'validator';

const FarmerLogin = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    mobileNumber: '',
    email: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Validate email, mobile number, and password
  const validateCredentials = () => {
    if (!validator.isEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters long');
      return false;
    }
    return true;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateCredentials()) return;

    setLoading(true);
    try {
      const response = await axiosClient.post('/user/sendotp', {
        emailId: formData.email
      });

      if (response.data.success) {
        setOtpSent(true);
        setStep(2);
        setCountdown(60); // 60 sec countdown
        setSuccess('OTP sent to your registered email');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and login
  const handleVerifyOtpAndLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.otp.match(/^[0-9]{6}$/)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/user/login', {
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        otp: formData.otp
      });

      if (response.data.success) {
        localStorage.setItem('farmerToken', response.data.token);
        localStorage.setItem('farmerData', JSON.stringify(response.data.farmer));

        setStep(3);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError('');
    try {
      await axiosClient.post('/user/sendotp', { emailId: formData.email });
      setCountdown(60);
      setSuccess('OTP resent successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setOtpSent(false);
  };

  return (
    <div className="farmer-login-container">
      <div className="farmer-login-card">
        <div className="login-header">
          <h2>Farmer Login</h2>
          <p>Access your agricultural services account</p>
        </div>

        {success && <div className="alert alert-success">✓ {success}</div>}
        {error && <div className="alert alert-error">⚠ {error}</div>}

        {/* Step 1: Credentials */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Your Email"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <div className="input-with-prefix">
                <span className="prefix">+91</span>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password/PIN</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtpAndLogin} className="login-form">
            <div className="otp-header">
              <button type="button" className="back-button" onClick={handleGoBack}>
                ← Back
              </button>
              <h3>Verify OTP</h3>
            </div>

            <p>OTP sent to: {formData.email}</p>

            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="tel"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
                disabled={loading}
              />
            </div>

            <div className="otp-resend">
              {countdown > 0 ? (
                <span>Resend OTP in {countdown} seconds</span>
              ) : (
                <button type="button" onClick={handleResendOtp} disabled={loading}>
                  Resend OTP
                </button>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <h3>Login Successful!</h3>
            <p>Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerLogin;
