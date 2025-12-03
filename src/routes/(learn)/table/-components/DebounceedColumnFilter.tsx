import { useEffect, useState } from 'react'
import { useDebounce } from '../-utils/useDebounce';
import { Input } from '@/components/ui/input';
import type { Column } from '@tanstack/react-table';

const DebounceedColumnFilter = ({ column }: { column: Column<any, unknown> }) => {
  const initialValue = (column.getFilterValue() as string) ?? "";
  const [value, setValue] = useState(initialValue);

  // Sync external filter → input state if table updates
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debounceVal = useDebounce(value, 500);

  // Apply filter only when debounced
  useEffect(() => {
    column.setFilterValue(debounceVal);
  }, [debounceVal, column]);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Search ${column.id}...`}
      className="mt-2 h-8"
    />
  );
}

export default DebounceedColumnFilter