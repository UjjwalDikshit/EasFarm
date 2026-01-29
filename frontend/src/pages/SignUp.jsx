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
  <div className="min-h-screen flex items-center justify-center px-4 py-10
    bg-gradient-to-br from-violet-100 via-indigo-100 to-blue-100">

    <div className="w-full max-w-4xl">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-lg">
          <FaGlobeAsia className="text-white text-2xl" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Farmer Registration
        </h1>
        <p className="mt-2 text-gray-700">
          Register to access smart agricultural services
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-6 md:p-8">

          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between">
              {steps.map(step => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-sm
                    ${currentStep >= step.number
                      ? 'text-indigo-700'
                      : 'text-gray-500'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2
                    ${currentStep >= step.number
                      ? 'bg-indigo-100 border-indigo-700'
                      : 'bg-gray-200 border-gray-400'}`}
                  >
                    {currentStep > step.number ? (
                      <FaCheckCircle className="text-indigo-700" />
                    ) : (
                      <span className="text-gray-700">{step.icon}</span>
                    )}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
              ))}
            </div>

            <div className="relative mt-4 h-1 bg-gray-300 rounded-full">
              <div
                className="absolute left-0 top-0 h-1 rounded-full
                  bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                  transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-lg bg-emerald-100 border border-emerald-300 p-4 text-emerald-800 font-medium">
              {success} Redirecting to login…
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-100 border border-red-300 p-4 text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  ['fullName', 'Full Name'],
                  ['mobileNumber', 'Mobile Number'],
                  ['alternateMobile', 'Alternate Mobile'],
                  ['emailId', 'Email Address'],
                  ['password', 'Password'],
                  ['confirmPassword', 'Confirm Password'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      {label}
                    </label>
                    <input
                      type={name.includes('password') ? 'password' : 'text'}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      placeholder={label}
                      className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-600
                        ${formErrors[name] ? 'border-red-500' : 'border-gray-400'}`}
                    />
                    {formErrors[name] && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        {formErrors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 rounded-lg text-white font-semibold
                    bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                    hover:opacity-95"
                >
                  Next Step →
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Address Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  ['villageOrCity', 'Village / City'],
                  ['district', 'District'],
                  ['state', 'State'],
                  ['pincode', 'Pincode'],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      placeholder={label}
                      className={`w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-indigo-600
                        ${formErrors[name] ? 'border-red-500' : 'border-gray-400'}`}
                    />
                    {formErrors[name] && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        {formErrors[name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2 rounded-lg border border-gray-400
                    text-gray-800 font-medium bg-gray-100 hover:bg-gray-200"
                >
                  ← Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 rounded-lg text-white font-semibold
                    bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"
                >
                  Next Step →
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Location & Consent
              </h2>

              <div className="space-y-5">
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full py-2 rounded-lg text-white font-semibold
                    bg-gradient-to-r from-indigo-600 to-blue-600
                    disabled:opacity-70"
                >
                  {locationLoading ? 'Detecting Location…' : 'Get Current Location'}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['latitude', 'longitude'].map(coord => (
                    <input
                      key={coord}
                      type="number"
                      name={`gpsLocation.${coord}`}
                      value={formData.gpsLocation[coord]}
                      onChange={handleInputChange}
                      placeholder={coord}
                      className="w-full rounded-lg border border-gray-400 px-3 py-2
                        text-gray-900 placeholder-gray-500
                        focus:ring-2 focus:ring-indigo-600"
                    />
                  ))}
                </div>

                <label className="flex items-center gap-3 bg-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    I accept Terms & Privacy Policy
                  </span>
                </label>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevStep}
                    className="px-5 py-2 rounded-lg border border-gray-400
                      text-gray-800 bg-gray-100 hover:bg-gray-200 font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-lg text-white font-semibold
                      bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                      disabled:opacity-70"
                  >
                    {isLoading ? 'Creating Account…' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-indigo-100 border-t px-6 py-4 text-center">
          <p className="text-sm text-gray-800">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-700 hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
);





};

export default SignUp;