"use client"
import { useEffect } from "react"

const Page = () => {
  useEffect(() => {
    location.href = '/dashboard/my-tasks'
  }, [])
  return ''
}
export default Page