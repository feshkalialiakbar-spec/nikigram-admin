'use server'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { callLogAPI } from '@/app/api/logproxy/callLog'
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
  store.set('iosdfuh0374ljfgh30249tjdgvrsetyt45p97y8g23rv12653frberfou314r87g123weou7rg6f47ee', crypto.createHash('md5').update(data.access_token).digest('hex'), {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  store.set('34a435y6546pr656rj67gm789peua677689awe890rguy987e89r69gr890rtk6mg5ps447e', data.access_token, {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  store.set('67gmrhj3246789aergpeu2zfgsd3565sdfg77689awe89034a4355534w45yghbt5k6mg5pser447ee', crypto.createHash('sha256').update(data.access_token).digest('hex'), {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  store.set('6kuefg7akjf61r5gfastdf123fgasfd65f23irrwegyr152evdtu78a5rjgvsfaysggasfd8a8w35wetgfse', crypto.createHash('sha512').update(data.access_token).digest('hex'), {
    maxAge: (60 * 60) / 2,
    path: '/',
  })
  store.set('mobile', mobile)
}

export async function deleteAllCookies() {
  const store = await cookies()
  store.delete('iosdfuh0374ljfgh30249tjdgvrsetyt45p97y8g23rv12653frberfou314r87g123weou7rg6f47ee')
  store.delete('34a435y6546pr656rj67gm789peua677689awe890rguy987e89r69gr890rtk6mg5ps447e')
  store.delete('67gmrhj3246789aergpeu2zfgsd3565sdfg77689awe89034a4355534w45yghbt5k6mg5pser447ee')
  store.delete('6kuefg7akjf61r5gfastdf123fgasfd65f23irrwegyr152evdtu78a5rjgvsfaysggasfd8a8w35wetgfse')
  store.delete('role')
  store.delete('lastlogin_date')
  store.delete('lastlogin_time')
  store.delete('user_status')
  store.delete('mobile')
  store.delete('deposit-amount')
  store.delete('deposit-token')
  store.delete('deposit-receipt')
}

export async function getAllCookies() {
  const store = await cookies()
  return store.getAll()
}

export async function getCookieByKey(name: string) {
  const store = await cookies()
  return store.get(name)?.value
}
export async function getoken(source = 'vergena') {
  const store = await cookies()
  const token = store.get('34a435y6546pr656rj67gm789peua677689awe890rguy987e89r69gr890rtk6mg5ps447e')?.value
  const origin = source?.trim() || 'vergena'
  callLogAPI({
    message: `${origin} , ${token ?? 'NO_TOKEN'}`,
    type: 'info',
    filekoin: 'cookieToken.ts',
  })
  return token
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
