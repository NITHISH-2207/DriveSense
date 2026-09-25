import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Info } from 'lucide-react';
import { AuthCanvas } from '../components/AuthCanvas';
import { Input } from '../components/Input';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryAction } from '../components/PrimaryAction';
import { PageTransition } from '../components/PageTransition';

/**
 * LoginPage: Open Canvas Experience for DriveSense.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccessMessage = location.state?.message;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState(null);
  const [showForgotTooltip, setShowForgotTooltip] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your email or phone number.';
    }
    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setDemoFeedback(null);

    // Safe frontend prototype authentication simulation -> redirect to /home
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home');
    }, 450);
  };

  return (
    <PageTransition>
      <AuthCanvas
        statement="Welcome back."
        supporting="Your vehicle is waiting."
        fieldVariant="login"
        activeField={activeField}
      >
        {/* Success Banner if redirected from Signup */}
        {signupSuccessMessage && (
          <div className="mb-8 p-3 rounded-cta bg-[#E8F5F1] border-l-2 border-[#176B5B] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#3C9A70] flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-medium text-[#176B5B]">
              {signupSuccessMessage}
            </p>
          </div>
        )}

        {/* Form directly on the open canvas */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7" noValidate>
          {/* Email / Phone Field */}
          <Input
            id="login-identifier"
            label="Email or Phone"
            type="text"
            required
            placeholder="driver@example.com or phone"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) setErrors({ ...errors, identifier: null });
            }}
            onFocus={() => setActiveField('identifier')}
            onBlur={() => setActiveField(null)}
            error={errors.identifier}
            autoComplete="username"
          />

          {/* Password Field */}
          <div className="space-y-2">
            <PasswordInput
              id="login-password"
              label="Password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              onFocus={() => setActiveField('password')}
              onBlur={() => setActiveField(null)}
              error={errors.password}
              autoComplete="current-password"
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end relative">
              <button
                type="button"
                onClick={() => setShowForgotTooltip(!showForgotTooltip)}
                onMouseEnter={() => setShowForgotTooltip(true)}
                onMouseLeave={() => setShowForgotTooltip(false)}
                className="text-xs text-[#66736F] hover:text-[#176B5B] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded py-1"
              >
                Forgot password?
              </button>

              {/* Tooltip */}
              {showForgotTooltip && (
                <div
                  role="tooltip"
                  className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-[#1F2927] text-white text-xs rounded-lg shadow-md pointer-events-none whitespace-nowrap z-30"
                >
                  Password reset will be available soon in the next release.
                  <div className="w-2 h-2 bg-[#1F2927] rotate-45 absolute -bottom-1 right-5" />
                </div>
              )}
            </div>
          </div>

          {/* Compact CTA & Switcher Row */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <PrimaryAction
              type="submit"
              isLoading={isLoading}
            >
              Sign In
            </PrimaryAction>

            <p className="text-xs sm:text-sm text-[#66736F]">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-[#176B5B] hover:text-[#125247] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#176B5B] rounded p-0.5 inline-block"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Demo Feedback Notice */}
          {demoFeedback && (
            <div className="p-3 rounded-cta bg-[#E8F5F1]/50 border-l-2 border-[#176B5B] flex items-start gap-2.5 text-xs text-[#66736F]">
              <Info className="w-4 h-4 text-[#176B5B] flex-shrink-0 mt-0.5" />
              <span>{demoFeedback.text}</span>
            </div>
          )}
        </form>
      </AuthCanvas>
    </PageTransition>
  );
};

export default LoginPage;
