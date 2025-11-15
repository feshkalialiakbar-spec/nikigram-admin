import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const logFilePath = path.join(process.cwd(), 'logs', 'logs.json')

interface LogEntry {
  timestamp: string
  url: string
  method: string
  status: number
  request: {
    body: unknown
  }
  response: unknown
}

function toCSV(logs: LogEntry[]) {
  const header = [
    'timestamp',
    'url',
    'method',
    'status',
    'request_body',
    'response',
  ]
  const rows = logs.map((log) => [
    log.timestamp,
    log.url,
    log.method,
    log.status,
    JSON.stringify(log.request.body),
    JSON.stringify(log.response),
  ])

  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  return csv
}

export async function GET(req: NextRequest) {
  try {
    const start = req.nextUrl.searchParams.get('start')
    const end = req.nextUrl.searchParams.get('end')

    if (!start || !end) {
      return NextResponse.json(
        { error: 'start and end query params are required' },
        { status: 400 }
      )
    }

    const logs: LogEntry[] = fs.existsSync(logFilePath)
      ? (JSON.parse(fs.readFileSync(logFilePath, 'utf-8')) as LogEntry[])
      : []

    const filteredLogs = logs.filter((log: LogEntry) => {
      const date = new Date(log.timestamp)
      return date >= new Date(start) && date <= new Date(end)
    })

    const csv = toCSV(filteredLogs)

    const now = new Date()
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, -5)
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="logs-${dateStr}.csv"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
