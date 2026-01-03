import { createFileRoute } from '@tanstack/react-router'
import Demo from './-components/Demo'

export const Route = createFileRoute('/(learn)/typescript/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col">
      <Demo />
    </div>
  )
}
