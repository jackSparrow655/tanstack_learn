import { DataTable } from './data-table'
import { columns } from './columns'
import type { User } from './types'
import { useState } from 'react'
import { AdvancedFilter } from 'react-adv-filter'
import 'react-adv-filter/style.css'
function generateDescription(index: number = 200) {
  const lorem =
    'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(
      ' ',
    )

  const result: string[] = []
  const words = index % 2 == 1 ? 100 : 200

  for (let i = 0; i < words; i++) {
    // pick random word so descriptions differ
    const randomWord = lorem[Math.floor(Math.random() * lorem.length)]
    result.push(randomWord)
  }

  return result.join(' ')
}

export const bigData: User[] = Array.from({ length: 50000 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 ? 'Admin' : 'User',
  description: generateDescription(i), // 👈 added 200-word auto text
  amount: Number(
    Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
  ).toString(),
}))

const COLUMNS = [
  { id: 'name', label: 'Full Name', type: 'string' },
  { id: 'email', label: 'Email', type: 'string' },
  { id: 'role', label: 'Role', type: 'select', options: ['Admin', 'User'] },
  { id: 'amount', label: 'Amount', type: 'number' },
]

export default function Table() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(bigData)
  const [filteredData, setFilteredData] = useState(bigData)

  return (
    <div className="p-5">
      <button onClick={() => setIsOpen(true)}>Open Filters</button>
      <DataTable columns={columns} data={filteredData} height={600} />
      <AdvancedFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        data={data}
        //@ts-ignore
        columns={COLUMNS}
        setFilteredData={setFilteredData}
      />
    </div>
  )
}
