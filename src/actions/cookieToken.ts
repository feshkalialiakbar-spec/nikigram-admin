'use server'
import { cookies } from 'next/headers'

export interface IAccessTokenResponse {
  status: string,
  access_token: string
  message: string,
  user_id: number
}

export async function setTokenIntoCookie({
  data,
  mobile,
}: {
  data: IAccessTokenResponse
  mobile: string
}) {
  const store = await cookies()
  store.set('access_token', data.access_token, {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  store.set('mobile', mobile)
}

export async function deleteAllCookies() {
  const store = await cookies()
  store.delete('access_token')
  store.delete('role')
  store.delete('lastlogin_date')
  store.delete('lastlogin_time')
  store.delete('user_status')
  store.delete('mobile')
  store.delete('deposit-amount')
  store.delete('deposit-token')
  store.delete('deposit-receipt')
  // cookies().delete("token_type");
  // cookies().delete("last_login_ip");
  // cookies().delete("user_status");
  // cookies().delete("city_level");
  // cookies().delete("customer_code");
  // cookies().delete("approve_status");
}

export async function getAllCookies() {
  const store = await cookies()
  return store.getAll()
}

export async function getCookieByKey(name: string) {
  const store = await cookies()
  return store.get(name)?.value
}

interface ITagAndValue {
  key: string
  value: string
}
export async function setCookieByTagAndValue({ key, value }: ITagAndValue) {
  const store = await cookies()
  store.set(key, value)
}
export async function setCookieByTagAndValueAndPath({
  key,
  value,
  path,
}: {
  key: string
  value: string
  path: string
}) {
  const store = await cookies()
  store.set(key, value, {
    path,
  })
}

export async function deleteCookieByKey(key: string) {
  const store = await cookies()
  store.delete(key)
}
