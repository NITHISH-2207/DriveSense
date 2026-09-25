import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCanvas } from '../components/AuthCanvas';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryAction } from '../components/PrimaryAction';
import { PageTransition } from '../components/PageTransition';

/**
 * SignupPage: Open Canvas Experience for DriveSense.
 */
export const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [activeField, setActiveField] = useState(null);
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setActiveField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  // Validation rules
  const isFullNameValid = formData.fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = formData.phone.trim().length >= 8;
  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const isFormValid =
    isFullNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isPasswordValid &&
    doPasswordsMatch;

  // Friendly error messages
  const getFieldError = (field) => {
    if (!touched[field]) return null;

    switch (field) {
      case 'fullName':
        if (!formData.fullName.trim()) return 'Please enter your name.';
        if (formData.fullName.trim().length < 2) return 'Name is too short.';
        return null;
      case 'email':
        if (!formData.email.trim()) return 'Please enter your email.';
        if (!isEmailValid) return 'Please check your email address.';
        return null;
      case 'phone':
        if (!formData.phone.trim()) return 'Please enter your phone number.';
        if (!isPhoneValid) return 'Please check your phone number.';
        return null;
      case 'password':
        if (!formData.password) return 'Please enter a password.';
        if (formData.password.length < 6) return 'Password must be at least 6 characters.';
        return null;
      case 'confirmPassword':
        if (!formData.confirmPassword) return 'Please confirm your password.';
        if (formData.password !== formData.confirmPassword) return "Passwords don't match.";
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setTouched({
        fullName: true,
        email: true,
        phone: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsLoading(true);

    // Safe frontend signup completion -> redirect to /home
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home');
    }, 450);
  };

  return (
    <PageTransition>
      <AuthCanvas
        statement="Let's begin."
        supporting="Create your DriveSense account."
        fieldVariant="signup"
        activeField={activeField}
      >
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
          {/* Full Name */}
          <Input
            id="signup-fullname"
            label="Full Name"
            type="text"
            required
            placeholder="Alex Morgan"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onFocus={() => handleFocus('fullName')}
            onBlur={() => handleBlur('fullName')}
            error={getFieldError('fullName')}
            autoComplete="name"
          />

          {/* Email & Phone in Open Canvas layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <Input
              id="signup-email"
              label="Email"
              type="email"
              required
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              error={getFieldError('email')}
              autoComplete="email"
            />

            <Input
              id="signup-phone"
              label="Phone Number"
              type="tel"
              required
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onFocus={() => handleFocus('phone')}
              onBlur={() => handleBlur('phone')}
              error={getFieldError('phone')}
              autoComplete="tel"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <PasswordInput
              id="signup-password"
              label="Password"
              required
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              error={getFieldError('password')}
              autoComplete="new-password"
            />

            <PasswordInput
              id="signup-confirm-password"
              label="Confirm Password"
              required
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
              error={getFieldError('confirmPassword')}
              autoComplete="new-password"
            />
          </div>

          {/* Compact CTA & Switcher Row */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <PrimaryAction
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid && Object.keys(touched).length > 0}
            >
              Create Account
            </PrimaryAction>

            <p className="text-xs sm:text-sm text-[#66736F]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#176B5B] hover:text-[#125247] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded p-0.5 inline-block"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </AuthCanvas>
    </PageTransition>
  );
};

export default SignupPage;
