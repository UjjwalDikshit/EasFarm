import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  clearError, 
  clearSuccess, 
  logout, 
  setCountdown, 
  resetOtpState, 
  setRegistrationStep,
  resetRegistrationState 
} from "../features/authSlice";
import { registerFarmer } from '../features/authSlice'; // Make sure this is exported from your slice

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { isLoading, error, success, registrationStep } = useAppSelector((state) => state.auth);
  
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

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
      dispatch(setRegistrationStep(1));
    };
  }, [dispatch]);

  useEffect(() => {
    if (success && registrationStep === 1) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, registrationStep, navigate]);

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

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (error) dispatch(clearError());
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    if (formData.alternateMobile && !/^[0-9]{10}$/.test(formData.alternateMobile)) errors.alternateMobile = 'Please enter a valid 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) errors.emailId = 'Please enter a valid email address';
    if (formData.password.length < 4) errors.password = 'Password must be at least 4 characters long';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.villageOrCity.trim()) errors.villageOrCity = 'Village or city is required';
    if (!formData.district.trim()) errors.district = 'District is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!/^[0-9]{6}$/.test(formData.pincode)) errors.pincode = 'Please enter a valid 6-digit pincode';
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!formData.gpsLocation.latitude || !formData.gpsLocation.longitude) errors.gpsLocation = 'GPS location is required';
    if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the Terms & Conditions';
    return errors;
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      dispatch(clearError());
      return;
    }

    dispatch(clearError());
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          gpsLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
        setFormData(prev => ({
          ...prev,
          gpsLocation: { latitude: '28.6139', longitude: '77.2090' }
        }));
      }
    );
  };

  const handleNextStep = () => {
    let errors = {};
    if (registrationStep === 1) errors = validateStep1();
    else if (registrationStep === 2) errors = validateStep2();
    else if (registrationStep === 3) errors = validateStep3();
    setFormErrors(errors);
    if (!Object.keys(errors).length) dispatch(setRegistrationStep(registrationStep + 1));
  };

  const handlePrevStep = () => {
    dispatch(setRegistrationStep(registrationStep - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const errors = validateStep3();
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      const submitData = {
        ...formData,
        gpsLocation: {
          type: 'Point',
          coordinates: [parseFloat(formData.gpsLocation.longitude), parseFloat(formData.gpsLocation.latitude)]
        }
      };
      delete submitData.confirmPassword;
      await dispatch(registerFarmer(submitData)).unwrap();
    } catch (err) {}
  };

  const progressPercentage = ((registrationStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-700">Farmer Registration</h2>
            <p className="text-gray-600 mt-2">Create your agricultural services account</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {registrationStep} of 3</span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <progress className="progress progress-primary w-full" value={progressPercentage} max="100"></progress>
          </div>

          {success && (
            <div className="alert alert-success shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 */}
          {registrationStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Full Name *</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required className={`input input-bordered ${formErrors.fullName ? 'input-error' : ''}`} />
                  {formErrors.fullName && <label className="label"><span className="label-text-alt text-error">{formErrors.fullName}</span></label>}
                </div>
                {/* Mobile Number */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Mobile Number *</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder="10-digit mobile number" maxLength="10" required className={`input input-bordered ${formErrors.mobileNumber ? 'input-error' : ''}`} />
                  {formErrors.mobileNumber && <label className="label"><span className="label-text-alt text-error">{formErrors.mobileNumber}</span></label>}
                </div>
                {/* Alternate Mobile */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Alternate Mobile</span></label>
                  <input type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleInputChange} placeholder="Optional alternate number" maxLength="10" className={`input input-bordered ${formErrors.alternateMobile ? 'input-error' : ''}`} />
                  {formErrors.alternateMobile && <label className="label"><span className="label-text-alt text-error">{formErrors.alternateMobile}</span></label>}
                </div>
                {/* Email */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Email Address *</span></label>
                  <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} placeholder="Enter your email" required className={`input input-bordered ${formErrors.emailId ? 'input-error' : ''}`} />
                  {formErrors.emailId && <label className="label"><span className="label-text-alt text-error">{formErrors.emailId}</span></label>}
                </div>
                {/* Password */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Password *</span></label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="At least 4 characters" minLength="4" required className={`input input-bordered ${formErrors.password ? 'input-error' : ''}`} />
                  {formErrors.password && <label className="label"><span className="label-text-alt text-error">{formErrors.password}</span></label>}
                </div>
                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Confirm Password *</span></label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your password" required className={`input input-bordered ${formErrors.confirmPassword ? 'input-error' : ''}`} />
                  {formErrors.confirmPassword && <label className="label"><span className="label-text-alt text-error">{formErrors.confirmPassword}</span></label>}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button type="button" onClick={handleNextStep} className="btn btn-primary">Next → Address Details</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {registrationStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <button type="button" className="btn btn-ghost btn-sm" onClick={handlePrevStep}>← Back</button>
                <h3 className="text-lg font-semibold text-green-700 ml-2">Address Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Village/City *</span></label>
                  <input type="text" name="villageOrCity" value={formData.villageOrCity} onChange={handleInputChange} placeholder="Enter village or city" required className={`input input-bordered ${formErrors.villageOrCity ? 'input-error' : ''}`} />
                  {formErrors.villageOrCity && <label className="label"><span className="label-text-alt text-error">{formErrors.villageOrCity}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">District *</span></label>
                  <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="Enter district" required className={`input input-bordered ${formErrors.district ? 'input-error' : ''}`} />
                  {formErrors.district && <label className="label"><span className="label-text-alt text-error">{formErrors.district}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">State *</span></label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state" required className={`input input-bordered ${formErrors.state ? 'input-error' : ''}`} />
                  {formErrors.state && <label className="label"><span className="label-text-alt text-error">{formErrors.state}</span></label>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Pincode *</span></label>
                  <input type="tel" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit pincode" maxLength="6" required className={`input input-bordered ${formErrors.pincode ? 'input-error' : ''}`} />
                  {formErrors.pincode && <label className="label"><span className="label-text-alt text-error">{formErrors.pincode}</span></label>}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button type="button" onClick={handlePrevStep} className="btn btn-ghost">← Personal Details</button>
                <button type="button" onClick={handleNextStep} className="btn btn-primary">Next → Location & Consent</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {registrationStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <button type="button" className="btn btn-ghost btn-sm" onClick={handlePrevStep}>← Back</button>
                <h3 className="text-lg font-semibold text-green-700 ml-2">Location & Consent</h3>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">GPS Location *</span></label>
                <div className="flex gap-2">
                  <input type="number" step="any" name="gpsLocation.latitude" value={formData.gpsLocation.latitude} onChange={handleInputChange} placeholder="Latitude" className={`input input-bordered flex-1 ${formErrors.gpsLocation ? 'input-error' : ''}`} />
                  <input type="number" step="any" name="gpsLocation.longitude" value={formData.gpsLocation.longitude} onChange={handleInputChange} placeholder="Longitude" className={`input input-bordered flex-1 ${formErrors.gpsLocation ? 'input-error' : ''}`} />
                  <button type="button" onClick={getCurrentLocation} className="btn btn-outline">Get Location</button>
                </div>
                {formErrors.gpsLocation && <label className="label"><span className="label-text-alt text-error">{formErrors.gpsLocation}</span></label>}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" name="allowDataSharing" checked={formData.allowDataSharing} onChange={handleInputChange} className="checkbox checkbox-primary" />
                  <span className="label-text">I agree to share my data for agricultural research and improved services</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} className={`checkbox checkbox-primary ${formErrors.acceptTerms ? 'checkbox-error' : ''}`} />
                  <span className="label-text">I accept the Terms & Conditions and Privacy Policy *</span>
                </label>
                {formErrors.acceptTerms && <label className="label"><span className="label-text-alt text-error">{formErrors.acceptTerms}</span></label>}
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={handlePrevStep} className="btn btn-ghost">← Address Details</button>
                <button type="button" onClick={handleSubmit} disabled={isLoading} className="btn btn-primary">
                  {isLoading ? <><span className="loading loading-spinner"></span>Registering...</> : 'Complete Registration'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="link link-primary font-semibold">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
