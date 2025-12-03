import { createFileRoute } from '@tanstack/react-router'
import Table from './-components/table'

export const Route = createFileRoute('/(learn)/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-full w-full">
      <Table />
    </div>
  )
}
