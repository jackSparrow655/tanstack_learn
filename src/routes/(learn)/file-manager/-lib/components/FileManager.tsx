import React, { useMemo } from 'react'
import { Filemanager } from '@svar-ui/react-filemanager'
import '@svar-ui/react-filemanager/all.css'
import { Willow } from '@svar-ui/react-filemanager'

type Props = {
  paths: string[]
}

type FileItem = {
  id: string
  size: number
  date: Date
  type: 'file' | 'folder'
}

const FileManagerComponent: React.FC<Props> = ({ paths }) => {
  const data: FileItem[] = useMemo(() => {
    const map = new Map<string, FileItem>()

    const isFile = (path: string) => {
      return path.split('/').pop()?.includes('.')
    }

    paths.forEach((fullPath) => {
      if (!fullPath) return

      const parts = fullPath.split('/').filter(Boolean)

      let currentPath = ''

      parts.forEach((part) => {
        currentPath += '/' + part

        if (!map.has(currentPath)) {
          const file = isFile(currentPath)

          map.set(currentPath, {
            id: currentPath,
            size: file ? 1000 : 4096,
            date: new Date(),
            type: file ? 'file' : 'folder'
          })
        }
      })
    })

    return Array.from(map.values())
  }, [paths])

  return (
    <Willow>
      <Filemanager data={data} />
    </Willow>
  )
}

export default FileManagerComponent
