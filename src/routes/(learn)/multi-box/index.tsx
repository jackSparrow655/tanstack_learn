import { createFileRoute } from '@tanstack/react-router'
import Trapezium from './-components/Trapizium'
import TrapeziumSVG from './-components/TrapiziumSvg'

export const Route = createFileRoute('/(learn)/multi-box/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex-1 flex items-center      ' >
    <Trapezium/>
    <TrapeziumSVG/>
  </div>
}
