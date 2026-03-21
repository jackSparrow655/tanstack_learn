import { useEffect, useState } from 'react'
import { Filemanager, Willow } from '@svar-ui/react-filemanager'
import { createDB } from '../utils/db'

type FileItem = {
  id: string
  size: number
  date: Date
  type: 'folder'
}

const FileManagerFromDB = () => {
  const [data, setData] = useState<FileItem[]>([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const db = await createDB()

    const docs = await db.paths.find().exec()

    // ✅ fix type
    const paths: string[] = docs.map((d: any) => d.path)

    // ✅ typed map
    const map = new Map<string, FileItem>()

    const isFile = (p: string) => {
      const last = p.split('/').pop()
      return last ? last.includes('.') : false
    }

    paths.forEach((p) => {
      const parts = p.split('/').filter(Boolean)

      let cur = ''

      parts.forEach((part) => {
        cur += '/' + part

        if (!map.has(cur)) {
          map.set(cur, {
            id: cur,
            size: isFile(cur) ? 1000 : 4096,
            date: new Date(),
            type: 'folder',
          })
        }
      })
    })

    setData(Array.from(map.values()))
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Willow>
        <Filemanager data={data} readonly/>
      </Willow>
    </div>
  )
}

export default FileManagerFromDB
