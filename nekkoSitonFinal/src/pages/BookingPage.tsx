import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import "../styles/BookingPage.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service_id: number | "";
  date: string;
  message: string;
}

interface Service {
  id: number;
  name: string;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service_id: "",
    date: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    // Fetch services
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, name')
      .eq('is_custom', false);

    if (servicesError) {
      console.error("Error fetching services:", servicesError);
      setSubmitError("Could not load services. Please try again later.");
      return;
    }
    setServices(servicesData as Service[]);

    // Fetch user data and pre-fill form
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn("Could not fetch user profile.", profileError);
      }

      setFormData(prev => ({
        ...prev,
        name: profileData?.full_name || '',
        email: user.email || '',
        phone: profileData?.phone_number || '',
      }));
    } else {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: location, message: "Please log in to book a service." } });
    }

    // Pre-select service if passed from services page
    if (location.state?.serviceId) {
      setFormData(prev => ({ ...prev, service_id: location.state.serviceId }));
    }
  }, [navigate, location]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'service_id' ? (value ? parseInt(value, 10) : "") : value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (): boolean => {
    const currentErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name) { currentErrors.name = "Full name is required."; isValid = false; }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { currentErrors.email = "Valid email is required."; isValid = false; }
      if (!formData.phone) { currentErrors.phone = "Phone number is required."; isValid = false; }
    } else if (step === 2) {
      if (!formData.service_id) { currentErrors.service_id = "Please select a service."; isValid = false; }
      if (!formData.date) { currentErrors.date = "Preferred date is required."; isValid = false; }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => { if (validateStep()) setStep(prev => Math.min(prev + 1, totalSteps)); };
  const handlePrev = () => { setStep(prev => Math.max(prev - 1, 1)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== totalSteps - 1 || !validateStep()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitError("You must be logged in to book a service.");
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      service_id: formData.service_id,
      booking_date: formData.date,
      message: formData.message,
      status: 'pending',
    });

    if (error) {
      console.error("Booking failed:", error);
      setSubmitError(`Booking failed: ${error.message}. Please try again.`);
      setIsSubmitting(false);
    } else {
      setStep(totalSteps);
      setIsSubmitting(false);
    }
  };

  const getServiceName = (serviceId: number | "") => {
    if (!serviceId) return "N/A";
    return services.find(s => s.id === serviceId)?.name || "N/A";
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="step-heading">1. Contact Info</h2>
            <p className="step-subheading">Tell us how to reach you.</p>
            <div className="form-group">
              <label>Your Name *</label>
              <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label>Your Email *</label>
              <input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required readOnly/>
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" placeholder="+63 912 345 6789" value={formData.phone} onChange={handleChange} required />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="step-heading">2. Service Details</h2>
            <p className="step-subheading">What are you looking to book?</p>
            <div className="form-group">
              <label>Service *</label>
              <select name="service_id" value={formData.service_id} onChange={handleChange} required>
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
              {errors.service_id && <p className="error-message">{errors.service_id}</p>}
            </div>
            <div className="form-group">
              <label>Preferred Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
              {errors.date && <p className="error-message">{errors.date}</p>}
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" placeholder="Any additional details? (e.g., event location, specific requests)" value={formData.message} onChange={handleChange}></textarea>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="step-heading">3. Review and Confirm</h2>
            <p className="step-subheading">Please review your booking details before confirming.</p>
            <div className="review-details">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Service:</strong> {getServiceName(formData.service_id)}</p>
              <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Message:</strong> {formData.message || "N/A"}</p>
            </div>
            {submitError && <p className="error-message">{submitError}</p>}
          </>
        );
      case 4:
        return (
          <div className="confirmation-container">
            <h2 className="confirmation-heading">Booking Submitted!</h2>
            <p className="confirmation-message">Thank you for booking with us. We will contact you shortly to confirm the details. You can check the status on your profile page.</p>
            <button type="button" onClick={() => navigate('/profile')} className="next-btn">Go to Profile</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          {renderStepContent()}
          <div className="button-group">
            {step > 1 && step < totalSteps && (
              <button type="button" onClick={handlePrev} className="prev-btn">Back</button>
            )}
            {step < totalSteps - 1 && (
              <button type="button" onClick={handleNext} className="next-btn">Next</button>
            )}
            {step === totalSteps - 1 && (
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;