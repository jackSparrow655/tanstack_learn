import { createFileRoute } from '@tanstack/react-router'
import TestForm from './-components/TestForm'

export const Route = createFileRoute('/(learn)/zod/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col">
      <TestForm />
    </div>
  )
}
