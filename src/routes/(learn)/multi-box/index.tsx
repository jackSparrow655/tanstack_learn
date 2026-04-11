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
      <ProxyTest />
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

const ProxyTest = () => {
  const employee = {
    name: 'arijit barik',
    role: 'React developer',
    experience: '1 years',
    age: 20,
  }

  type EmployeeType = typeof employee
  type keyType = keyof EmployeeType
  type valueType = EmployeeType[keyType]

  const proxy = new Proxy(employee, {
    get(target: EmployeeType, prop: keyType) {
      console.log('Get:', target, prop)
      return target[`${prop}`]
    },
    set(target: EmployeeType, property: keyType, val: valueType) {
      console.log('Set:', target, property, val)
      if (property === 'age' && typeof val === 'number') {
        if (val < 40 && val > 0) {
          target[property] = val
        }
        return true
      } else {
        //@ts-ignore
        target[property] = val
        return true
      }
    },
  })

  const handlePrint = () => {
    console.log('name of employee : ', proxy.name)
    employee.role = 'Node.js developer'
    proxy.age = 50
    console.log('age of employee = ', proxy.age)
  }
  return (
    <div>
      <Button onClick={handlePrint}>proxy in console</Button>
    </div>
  )
}
