'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserLoginAPI, RequestOTP, LoginWithOtpAndMobile } from '@/services/user';

interface LoginFormData {
  phone: string;
  password: string;
}

interface LoginErrors {
  phone?: string;
  password?: string;
  general?: string;
}

interface UseLoginReturn {
  values: LoginFormData;
  errors: LoginErrors;
  isLoading: boolean;
  isOtpLoading: boolean;
  handleChange: (field: keyof LoginFormData, value: string) => void;
  handleFocus: (field: keyof LoginFormData) => void;
  handleBlur: (field: keyof LoginFormData, validator?: (value: string) => string) => void;
  handleLogin: () => Promise<void>;
  handleLoginWithOtp: () => Promise<void>;
  clearErrors: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormData>({
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFocus = (field: keyof LoginFormData) => {
    // Clear error on focus
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof LoginFormData, validator?: (value: string) => string) => {
    if (validator) {
      const error = validator(values[field]);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
    }
  };

  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  };

  const setUserData = (userData: { token?: string; access_token?: string; user_id?: string; id?: string; mobile?: string; name?: string; full_name?: string }) => {
    // Store user data in cookies
    setCookie('user_token', userData.token || userData.access_token || '', 7);
    setCookie('user_id', userData.user_id || userData.id || '', 7);
    setCookie('user_mobile', userData.mobile || values.phone, 7);
    setCookie('user_name', userData.name || userData.full_name || '', 7);
    setCookie('is_authenticated', 'true', 7);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      // Validate phone
      const phoneError = validatePhone(values.phone);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }

      // Validate password
      if (!values.password) {
        setErrors({ password: 'رمز عبور الزامی است' });
        return;
      }

      const response = await UserLoginAPI({
        mobile: values.phone,
        credential: values.password,
        auth: 'username_password'
      });

      console.log('Login response:', response); // Debug log

      // Only redirect if login is successful
      if (response && response.success === true) {
        setUserData(response);
        router.push('/dashboard');
      } else {
        // Show error message from API
        setErrors({ 
          general: response?.message || 'خطا در ورود. لطفاً مجدداً تلاش کنید.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'خطا در اتصال به سرور. لطفاً مجدداً تلاش کنید.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithOtp = async () => {
    try {
      setIsOtpLoading(true);
      setErrors({});

      // Validate phone
      const phoneError = validatePhone(values.phone);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }

      // Request OTP
      const otpResponse = await RequestOTP({
        mobile: values.phone,
        otptype: 'login'
      });

      console.log('OTP request response:', otpResponse); // Debug log

      if (otpResponse && otpResponse.success === true) {
        // Show OTP input modal or redirect to OTP page
        const otp = prompt('کد یکبار مصرف ارسال شده را وارد کنید:');
        if (otp) {
          const loginResponse = await LoginWithOtpAndMobile({
            mobile: values.phone,
            otp: otp
          });

          console.log('OTP login response:', loginResponse); // Debug log

          // Only redirect if OTP login is successful
          if (loginResponse && loginResponse.success === true) {
            setUserData(loginResponse);
            router.push('/dashboard');
          } else {
            setErrors({ general: loginResponse?.message || 'کد وارد شده اشتباه است.' });
          }
        }
      } else {
        setErrors({ general: otpResponse?.message || 'خطا در ارسال کد. لطفاً مجدداً تلاش کنید.' });
      }
    } catch (error) {
      console.error('OTP login error:', error);
      setErrors({ general: 'خطا در اتصال به سرور. لطفاً مجدداً تلاش کنید.' });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const validatePhone = (value: string): string => {
    if (!value) return 'شماره موبایل الزامی است';
    if (!/^09\d{9}$/.test(value))
      return 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
    return '';
  };

  return {
    values,
    errors,
    isLoading,
    isOtpLoading,
    handleChange,
    handleFocus,
    handleBlur,
    handleLogin,
    handleLoginWithOtp,
    clearErrors
  };
};
