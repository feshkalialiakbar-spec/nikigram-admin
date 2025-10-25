'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserLoginAPI, RequestOTP, LoginWithOtpAndMobile } from '@/services/user';
import { useToast } from '../ui';

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
  const { showSuccess } = useToast();
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

  const setCookie = (name: string, value: string, days: number = 7, minutes?: number) => {
    const expires = new Date();
    if (minutes) {
      // Set expiration in minutes (e.g., 30 minutes for tokens)
      expires.setTime(expires.getTime() + (minutes * 60 * 1000));
    } else {
      // Set expiration in days (default behavior)
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    }
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  };

  const setUserData = (userData: { token?: string; access_token?: string; user_id?: string; id?: string; mobile?: string; name?: string; full_name?: string }) => {
    // Store user token with 30 minutes expiration
    const token = userData.token || userData.access_token || '';
    if (token) {
      setCookie('user_token', token, 7, 30); // 30 minutes
    }
    
    // Store other user data with 7 days expiration
    setCookie('user_id', userData.user_id || userData.id || '', 7);
    setCookie('user_mobile', userData.mobile || values.phone, 7);
    setCookie('user_name', userData.name || userData.full_name || '', 7);
    setCookie('is_authenticated', 'true', 7);
    
    console.log('User data stored successfully:', {
      hasToken: !!token,
      userId: userData.user_id || userData.id,
      mobile: userData.mobile || values.phone
    });
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
      
      // Check if login is successful
      // Check multiple success conditions: success === true, status === '1', or response has token
      const isSuccess = response.success === true || response.status === '1' || response.status === 1 || !!(response.token || response.access_token);
      
      if (isSuccess) {
        // Verify token exists before proceeding
        const hasToken = !!(response.token || response.access_token);
        
        if (hasToken) {
          showSuccess('ورود با موفقیت انجام شد');
          setUserData(response);
          // Wait a moment for cookies to be set, then redirect
          setTimeout(() => {
            router.push('/dashboard');
            router.refresh(); // Force refresh to update the UI
          }, 100);
        } else {
          setErrors({
            general: 'خطا در دریافت اطلاعات ورود. لطفاً مجدداً تلاش کنید.'
          });
        }
      } else {
        // Show error message from API
        setErrors({
          general: response?.message || response?.detail || 'خطا در ورود. لطفاً مجدداً تلاش کنید.'
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

          // Check if OTP login is successful
          const isSuccess = loginResponse && (loginResponse.success === true || !!(loginResponse.token || loginResponse.access_token));
          
          if (isSuccess) {
            // Verify token exists before proceeding
            const hasToken = !!(loginResponse.token || loginResponse.access_token);
            
            if (hasToken) {
              showSuccess('ورود با موفقیت انجام شد');
              setUserData(loginResponse);
              // Wait a moment for cookies to be set, then redirect
              setTimeout(() => {
                router.push('/dashboard');
                router.refresh(); // Force refresh to update the UI
              }, 100);
            } else {
              setErrors({ general: 'خطا در دریافت اطلاعات ورود. لطفاً مجدداً تلاش کنید.' });
            }
          } else {
            setErrors({ general: loginResponse?.message || loginResponse?.detail || 'کد وارد شده اشتباه است.' });
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
