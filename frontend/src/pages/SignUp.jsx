import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaLock, 
  FaMapMarkerAlt, 
  FaGlobeAsia, 
  FaCheckCircle,
  FaLocationArrow,
  FaChevronRight,
  FaChevronLeft,
  FaMapPin,
  FaCity,
  FaLandmark,
  FaShieldAlt
} from 'react-icons/fa';

import { 
  clearError, 
  clearSuccess, 
  setRegistrationStep,
  registerFarmer 
} from '../features/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { isLoading, error, success, registrationStep } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    alternateMobile: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    villageOrCity: '',
    district: '',
    state: '',
    pincode: '',
    gpsLocation: { latitude: '', longitude: '' },
    acceptTerms: false,
    allowDataSharing: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (success && registrationStep === 1) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success,registrationStep, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    if (formData.alternateMobile && !/^[0-9]{10}$/.test(formData.alternateMobile)) {
      errors.alternateMobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      errors.emailId = 'Please enter a valid email address';
    }
    
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    
    if (!formData.villageOrCity.trim()) {
      errors.villageOrCity = 'Village or city is required';
    }
    
    if (!formData.district.trim()) {
      errors.district = 'District is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    
    if (!formData.gpsLocation.latitude || !formData.gpsLocation.longitude) {
      errors.gpsLocation = 'GPS location is required';
    } else {
      const lat = parseFloat(formData.gpsLocation.latitude);
      const lng = parseFloat(formData.gpsLocation.longitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.gpsLocation = 'Invalid latitude value';
      }
      
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.gpsLocation = 'Invalid longitude value';
      }
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the Terms & Conditions';
    }
    
    return errors;
  };

  const getCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationStatus('Fetching your location...');
    dispatch(clearError());
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          gpsLocation: {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }
        }));
        setLocationStatus(`Location captured: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Could not get location. Please enter manually.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'Error getting location. Please try again.';
        }
        
        setLocationStatus(errorMessage);
        setLocationLoading(false);
        
        // Set default location (India center) as fallback
        setFormData(prev => ({
          ...prev,
          gpsLocation: { 
            latitude: '20.5937', 
            longitude: '78.9629' 
          }
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleNextStep = () => {
    let errors = {};
    
    if (registrationStep === 1) {
      errors = validateStep1();
    } else if (registrationStep === 2) {
      errors = validateStep2();
    } else if (registrationStep === 3) {
      errors = validateStep3();
    }
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      if (registrationStep < 3) {
        dispatch(setRegistrationStep(registrationStep + 1));
      }
    }
  };

  const handlePrevStep = () => {
    if (registrationStep > 1) {
      dispatch(setRegistrationStep(registrationStep - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate step 3
    const errors = validateStep3();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // Prepare data for backend
      const submitData = {
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber,
        alternateMobile: formData.alternateMobile || undefined,
        emailId: formData.emailId.trim(),
        password: formData.password,
        villageOrCity: formData.villageOrCity.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
        gpsLocation: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.gpsLocation.longitude),
            parseFloat(formData.gpsLocation.latitude)
          ]
        },
        acceptTerms: formData.acceptTerms,
        allowDataSharing: formData.allowDataSharing
      };

      await dispatch(registerFarmer(submitData)).unwrap();
      
    } catch (err) {
      console.error('Registration error:', err);
      // Error is already handled by the Redux slice
    }
  };

  const progressPercentage = ((registrationStep - 1) / 3) * 100;

  const steps = [
    { number: 1, title: 'Personal Info', icon: <FaUser /> },
    { number: 2, title: 'Address', icon: <FaMapMarkerAlt /> },
    { number: 3, title: 'Location & Consent', icon: <FaCheckCircle /> }
  ];

  // If registrationStep is not defined, default to 1
  const currentStep = registrationStep || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <FaGlobeAsia className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Join Our Agricultural Community
          </h1>
          <p className="text-gray-600 text-lg">
            Register to access premium farming resources and services
          </p>
        </div>

        <div className="card bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${currentStep >= step.number 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                      }
                    `}>
                      {currentStep > step.number ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <span className="font-semibold">{step.icon}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="alert alert-success shadow-lg mb-6">
                <FaCheckCircle className="text-xl" />
                <div>
                  <h3 className="font-bold">Registration Successful!</h3>
                  <div className="text-xs">
                    {success}. Redirecting to login in 3 seconds...
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error shadow-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FaUser className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaUser className="text-green-500" /> Full Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.fullName ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.fullName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.fullName}</span>
                      </label>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaPhone className="text-green-500" /> Mobile Number *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.mobileNumber ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.mobileNumber && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.mobileNumber}</span>
                      </label>
                    )}
                  </div>

                  {/* Alternate Mobile */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaPhone className="text-green-500" /> Alternate Mobile
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleInputChange}
                      placeholder="Optional alternate number"
                      maxLength="10"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.alternateMobile ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.alternateMobile && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.alternateMobile}</span>
                      </label>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaEnvelope className="text-green-500" /> Email Address *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="emailId"
                      value={formData.emailId}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.emailId ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.emailId && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.emailId}</span>
                      </label>
                    )}
                  </div>

                  {/* Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaLock className="text-green-500" /> Password *
                      </span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 6 characters"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.password ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.password && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.password}</span>
                      </label>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaLock className="text-green-500" /> Confirm Password *
                      </span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.confirmPassword ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.confirmPassword && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.confirmPassword}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary bg-gradient-to-r from-green-500 to-emerald-600 border-none text-white hover:from-green-600 hover:to-emerald-700"
                  >
                    Next Step <FaChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-ghost btn-circle mr-3"
                    >
                      <FaChevronLeft />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
                      <p className="text-gray-600">Where are you located?</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Village/City */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaCity className="text-blue-500" /> Village/City *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="villageOrCity"
                      value={formData.villageOrCity}
                      onChange={handleInputChange}
                      placeholder="Enter village or city"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.villageOrCity ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.villageOrCity && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.villageOrCity}</span>
                      </label>
                    )}
                  </div>

                  {/* District */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaLandmark className="text-blue-500" /> District *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Enter district"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.district ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.district && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.district}</span>
                      </label>
                    )}
                  </div>

                  {/* State */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaMapPin className="text-blue-500" /> State *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.state ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.state && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.state}</span>
                      </label>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" /> Pincode *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className={`input input-bordered w-full bg-gray-50 ${
                        formErrors.pincode ? 'input-error' : ''
                      }`}
                    />
                    {formErrors.pincode && (
                      <label className="label">
                        <span className="label-text-alt text-error">{formErrors.pincode}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-ghost text-gray-600"
                  >
                    <FaChevronLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary bg-gradient-to-r from-blue-500 to-cyan-600 border-none text-white hover:from-blue-600 hover:to-cyan-700"
                  >
                    Next Step <FaChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location & Consent */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-ghost btn-circle mr-3"
                    >
                      <FaChevronLeft />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <FaLocationArrow className="text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Location & Consent</h2>
                      <p className="text-gray-600">Finalize your registration</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* GPS Location Card */}
                  <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-6 rounded-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <FaLocationArrow className="text-blue-500" /> GPS Location
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          We need your location to provide localized farming services and weather alerts.
                        </p>
                        {locationStatus && (
                          <div className={`text-sm ${
                            locationStatus.includes('captured') ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {locationStatus}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="btn btn-primary bg-gradient-to-r from-blue-500 to-cyan-600 border-none text-white hover:from-blue-600 hover:to-cyan-700"
                      >
                        {locationLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Detecting...
                          </>
                        ) : (
                          <>
                            <FaLocationArrow className="mr-2" />
                            Get My Location
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-gray-700">Latitude</span>
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="gpsLocation.latitude"
                          value={formData.gpsLocation.latitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 20.5937"
                          className={`input input-bordered w-full bg-white ${
                            formErrors.gpsLocation ? 'input-error' : ''
                          }`}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-gray-700">Longitude</span>
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="gpsLocation.longitude"
                          value={formData.gpsLocation.longitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 78.9629"
                          className={`input input-bordered w-full bg-white ${
                            formErrors.gpsLocation ? 'input-error' : ''
                          }`}
                        />
                      </div>
                    </div>
                    {formErrors.gpsLocation && (
                      <div className="mt-2">
                        <span className="label-text-alt text-error">{formErrors.gpsLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-4">
                    {/* Data Sharing */}
                    <div className="form-control">
                      <label className="label cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="allowDataSharing"
                            checked={formData.allowDataSharing}
                            onChange={handleInputChange}
                            className="checkbox checkbox-primary"
                          />
                          <div>
                            <span className="label-text font-medium text-gray-700">
                              Share data for agricultural research
                            </span>
                            <p className="text-gray-500 text-sm mt-1">
                              Help improve farming services by sharing anonymized data
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="form-control">
                      <label className={`
                        label cursor-pointer p-4 rounded-lg ${
                          formErrors.acceptTerms ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                        }
                      `}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            className={`checkbox checkbox-primary ${
                              formErrors.acceptTerms ? 'checkbox-error' : ''
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <FaShieldAlt className="text-green-500" />
                              <span className="label-text font-medium text-gray-700">
                                I accept the Terms & Conditions and Privacy Policy *
                              </span>
                            </div>
                            {formErrors.acceptTerms && (
                              <p className="text-error text-sm mt-1">{formErrors.acceptTerms}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-ghost text-gray-600"
                    >
                      <FaChevronLeft className="mr-2" /> Back to Address
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="btn btn-primary bg-gradient-to-r from-green-500 to-emerald-600 border-none text-white hover:from-green-600 hover:to-emerald-700"
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" />
                          Complete Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          registrationStep

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="link link-primary font-semibold text-green-600 hover:text-green-700"
                >
                  Login here
                </Link>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;