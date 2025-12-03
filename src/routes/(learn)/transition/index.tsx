import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(learn)/transition/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(learn)/transition/"!</div>
}
