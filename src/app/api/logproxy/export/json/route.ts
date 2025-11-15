import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
const logFilePath = path.join(process.cwd(), 'logs', 'logs.json')
interface LogEntry {
  timestamp: string
  url: string
  method: string
  status: number
  request: {
    headers: Record<string, string>
    body: unknown
  }
  response: unknown
}

function saveLog(log: LogEntry) {
  try {
    const logsDir = path.dirname(logFilePath)

    // اطمینان از وجود پوشه logs
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
      console.log('[+] logs directory created at:', logsDir)
    }

    // اگر فایل وجود دارد بخوان، وگرنه آرایه خالی
    const logs: LogEntry[] = fs.existsSync(logFilePath)
      ? (JSON.parse(fs.readFileSync(logFilePath, 'utf-8') || '[]') as LogEntry[])
      : []

    // اضافه کردن لاگ جدید
    logs.push(log)

    // ذخیره لاگ‌ها در فایل
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8')

    console.info('[✔] Log saved successfully.')
  } catch (err) {
    console.error('[×] Error while saving log:', err instanceof Error ? err.message : String(err))
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, method = 'POST', body = {}, headers = {} } = await req.json()

    const res = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    })

    const responseData = await res.json()

    const logData = {
      timestamp: new Date().toISOString(),
      url,
      method,
      request: {
        headers,
        body,
      },
      response: responseData,
      status: res.status,
    }

    saveLog(logData)

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
export const dynamic = 'force-dynamic'
