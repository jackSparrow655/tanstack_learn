import React from 'react'
import * as XLSX from 'xlsx'

type Props = {
  onData: (data: string[]) => void
}

const XlsxUploader: React.FC<Props> = ({ onData }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // allow only xlsx
    if (!file.name.endsWith('.xlsx')) {
      alert('Only .xlsx file allowed')
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target?.result

      if (!data) return

      const workbook = XLSX.read(data, {
        type: 'array',
      })

      const sheetName = workbook.SheetNames[0]

      const sheet = workbook.Sheets[sheetName]

      // fastest parsing
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: true,
      })

      const firstCol: string[] = []

      // efficient loop
      for (let i = 527; i < 700; i++) {
        const value = rows[i]?.[0]

        if (value !== undefined && value !== null) {
          firstCol.push(String(value))
        }
      }

      // send to parent
      onData(firstCol)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
    </div>
  )
}

export default XlsxUploader
