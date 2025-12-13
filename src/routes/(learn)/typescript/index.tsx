import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(learn)/typescript/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(learn)/typescript/"!</div>
}
