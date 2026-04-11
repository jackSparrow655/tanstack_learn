import { createFileRoute } from '@tanstack/react-router'
import Trapezium from './-components/Trapizium'
import TrapeziumSVG from './-components/TrapiziumSvg'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(learn)/multi-box/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 flex flex-col items-center">
      <Trapezium />
      <TrapeziumSVG />
      <Temp />
    </div>
  )
}

const makeFlatArr = (arr: any[]): any[] => {
  let tempArr: any[] = []
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i]
    if (Array.isArray(el)) {
      const flatArr = makeFlatArr(el)
      tempArr = [...tempArr, ...flatArr]
    } else tempArr.push(el)
  }
  return tempArr
}

const Temp = () => {
  const handlePrint = () => {
    const arr = [
      1,
      2,
      3,
      [4, 5, 6],
      7,
      8,
      [[9, [10, 11]], [12, 13], 14],
      15,
      [
        [16, 17],
        [18, 19],
      ],
    ]
    // const arr = [1, [2, [3, 4], 5], 6, 7] // output -> [1,2,3,4,5,6,7]
    console.log('given array = ', arr)
    // const flattenArr = makeFlatArr(arr)
    const flattenArr = arr.flat(Infinity)
    console.log('flatten array = ', flattenArr)
    console.log('hellow world')
  }
  return (
    <div>
      <Button onClick={handlePrint}>Print console</Button>
    </div>
  )
}
