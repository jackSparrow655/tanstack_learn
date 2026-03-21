import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { createDB } from '../utils/db'

const CHUNK = 100

const XlsxUploaderChunk = ({ onDone }: any) => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      console.log('FILE SELECTED')

      setLoading(true)

      console.log('Creating DB...')
      const db = await createDB()
      console.log('DB CREATED')

      console.log('Reading buffer...')
      const buffer = await file.arrayBuffer()
      console.log('Buffer read')

      console.log('Reading workbook...')
      const workbook = XLSX.read(buffer, {
        type: 'array',
      })

      console.log('Workbook read')

      const sheet = workbook.Sheets[workbook.SheetNames[0]]

      console.log('Converting to rows...')

      const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      })

      console.log('Rows length =', rows.length)

      let total = rows.length

      for (let i = 0; i < total; i += CHUNK) {
        console.log('Processing chunk', i, 'to', i + CHUNK)

        const chunk = rows.slice(i, i + CHUNK)

        const docs = []

        for (let j = 0; j < chunk.length; j++) {
          const val = chunk[j]?.[0]

          if (!val) continue

          docs.push({
            id: i + '_' + j,
            path: String(val),
          })
        }

        console.log('Inserting docs:', docs.length)

        if (docs.length > 0) {
          await db.paths.bulkInsert(docs)
        }

        const p = Math.floor(((i + CHUNK) / total) * 100)

        console.log('Progress:', p)

        setProgress(p)

        // allow UI update
        await new Promise((r) => setTimeout(r, 0))
      }

      console.log('DONE')

      setLoading(false)

      onDone()
    } catch (err) {
      console.error('UPLOAD ERROR', err)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading... {progress}%</div>

  return <input type="file" accept=".xlsx" onChange={handleUpload} />
}

export default XlsxUploaderChunk
