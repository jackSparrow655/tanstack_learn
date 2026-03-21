import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import FileManagerComponent from './-lib/components/FileManager'
import XlsxUploader from './-lib/components/XlsxUploader'
import XlsxUploaderChunk from './-lib/components/XlsxUploaderChunk'
import FileManagerFromDB from './-lib/components/FileManagerFromDB'

export const Route = createFileRoute('/(learn)/file-manager/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [paths, setPaths] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  return (
    <div className='flex-1 flex overflow-hidden'>
      {/* <XlsxUploader onData={setPaths} />

      <FileManagerComponent paths={paths} /> */}
      {!ready && <XlsxUploaderChunk onDone={() => setReady(true)} />}

      {ready && <FileManagerFromDB />}
    </div>
  )
}
