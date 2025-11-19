export const UserLoginAPI = async ({
  mobile,
  credential,
  auth = 'username_password'
}: {
  mobile: string,
  credential: string,
  auth?: 'username_password' | 'mobile_otp'
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login-otp2`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_method: auth,
        mobile,
        credential,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('UserLoginAPI error:', error)
    return {
      success: false,
      message: 'خطا در اتصال به سرور',
      error: error
    }
  }
}

export const GetOtpWithMobile = async ({ mobile }: { mobile: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/.api/v1/sbw_getotp/${mobile}`,
      {
        method: 'GET',
      }
    )

    if (response.status !== 200) {
      throw new Error('Failed to GetOtpWithMobile!')
    }

    return await response.json()
  } catch (error: unknown) {
    console.error('GetOtpWithMobile error:', error)
  }
}

export const RequestOTP = async ({ mobile, otptype, }: {
  mobile: string
  otptype: "verify" | 'login'
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/request-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, subsys_id: 3, otptype })
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { success: true, ...data }
    } else {
      return {
        success: false,
        message: data.detail || data.message || 'خطا در ارسال کد',
        status: response.status
      }
    }
  } catch (error: unknown) {
    console.error('RequestOTP error:', error)
    return {
      success: false,
      message: 'خطا در اتصال به سرور',
      error: error
    }
  }
}


export const LoginWithOtpAndMobile = async ({
  mobile,
  otp,
}: {
  mobile: string
  otp: string
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sbw_otplogin`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp, scopes: '3' }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { success: true, ...data }
    } else {
      return {
        success: false,
        message: data.detail || data.message || 'کد وارد شده اشتباه است',
        status: response.status
      }
    }
  } catch (error: unknown) {
    console.error('LoginWithOtpAndMobile error:', error)
    return {
      success: false,
      message: 'خطا در اتصال به سرور',
      error: error
    }
  }
}



