import { createFileRoute } from '@tanstack/react-router'
import type { FileType, FolderType, ItemType } from './-lib/type'
import { ChevronDown, ChevronRightIcon, File, Folder } from 'lucide-react'
import {
  useFolderStructureData,
  type SelectedFolderTypeForAdd,
} from './-lib/store/folderDataStore'
import { Input } from '@/components/ui/input'
import { useState, type SetStateAction } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export const Route = createFileRoute('/(learn)/folder-structure/')({
  component: RouteComponent,
})

const EditFileFolderInput = ({
  value,
  setEditDeleteModalOpen,
}: {
  value: string
  setEditDeleteModalOpen: (value: SetStateAction<boolean>) => void
}) => {
  const [inputVal, setInputVal] = useState(value)
  const handleInputChange = (e: any) => {
    setInputVal(e.target.value)
  }
  const {
    updateFolderStructureData,
    folderStructureData,
    selectedIdForEditDelete,
    setSelectedIdForEditDelete,
  } = useFolderStructureData()
  let copyData = structuredClone(folderStructureData)
  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      const itemIndexArr =
        selectedIdForEditDelete?.id?.split('.').map((item) => Number(item)) ??
        []
      const numberOfIndex = itemIndexArr?.length ?? 0
      const startFolder = copyData[itemIndexArr[0]] as FolderType
      const updatedFolder = handleAddEditDeleteFileFolder(
        startFolder,
        itemIndexArr,
        numberOfIndex,
        0,
        'edit',
        inputVal,
      )
      if (updatedFolder) {
        copyData[itemIndexArr[0]] = updatedFolder
      }
      updateFolderStructureData(copyData)
      setSelectedIdForEditDelete(null)
      setEditDeleteModalOpen(false)
    } else return
  }
  return (
    <Input
      value={inputVal}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      className="h-6 rounded-none p-0"
      autoFocus
    />
  )
}

const ItemComponent = ({ item }: { item: FileType | FolderType }) => {
  const [editDeleteModalOpen, setEditDeleteModalOpen] = useState<boolean>(false)
  const {
    setSelectedIdForEditDelete,
    selectedIdForEditDelete,
    folderStructureData,
    updateFolderStructureData,
    setSelectedFolderForAdd,
  } = useFolderStructureData()

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setEditDeleteModalOpen(true)
  }
  const handleDelete = (id: string) => {
    setSelectedIdForEditDelete({ id: id, action: 'delete' })
    let copyData = structuredClone(folderStructureData)
    const itemIndexArr = id?.split('.').map((item) => Number(item)) ?? []
    const numberOfIndex = itemIndexArr?.length ?? 0
    const startFolder = copyData[itemIndexArr[0]] as FolderType
    const updatedFolder = handleAddEditDeleteFileFolder(
      startFolder,
      itemIndexArr,
      numberOfIndex,
      0,
      'delete',
      undefined,
      undefined,
      id,
    )
    if (updatedFolder) {
      copyData[itemIndexArr[0]] = updatedFolder
    }
    updateFolderStructureData(copyData)
    setEditDeleteModalOpen(false)
  }

  const handleSelect = (type: 'file' | 'folder') => {
    const data: SelectedFolderTypeForAdd = {
      id: item.id,
      fileType: type,
    }
    setSelectedFolderForAdd(data)
  }

  return (
    <>
      {selectedIdForEditDelete?.action === 'edit' &&
      selectedIdForEditDelete?.id === item.id ? (
        <EditFileFolderInput
          value={item.name}
          setEditDeleteModalOpen={setEditDeleteModalOpen}
        />
      ) : (
        <Popover
          open={editDeleteModalOpen}
          onOpenChange={(e) => {
            if (e && !editDeleteModalOpen) return
            setEditDeleteModalOpen(e)
          }}
        >
          <PopoverTrigger asChild>
            <span
              onContextMenu={handleRightClick}
              className={`${editDeleteModalOpen && 'text-red-600'} cursor-pointer hover:text-red-600 -translate-x-1`}
            >
              {item.name}
            </span>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            onInteractOutside={() => {
              setEditDeleteModalOpen(false)
              setSelectedIdForEditDelete(null)
            }}
            className="flex flex-col py-0.5 pl-2 w-fit translate-y-11"
            onClick={(e) => e.stopPropagation()}
          >
            {item.isFolder && (
              <>
                <span
                  onClick={() => handleSelect('file')}
                  className="cursor-pointer hover:text-red-600"
                >
                  Add file
                </span>
                <span
                  onClick={() => handleSelect('folder')}
                  className="cursor-pointer hover:text-red-600"
                >
                  Add folder
                </span>
              </>
            )}
            <span
              onClick={() =>
                setSelectedIdForEditDelete({ id: item.id, action: 'edit' })
              }
              className="cursor-pointer hover:text-red-600"
            >
              Edit name
            </span>
            <span
              onClick={() => handleDelete(item.id)}
              className="cursor-pointer hover:text-red-600"
            >
              Delete
            </span>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

const toggleVisibility = (
  item: FolderType,
  indexArr: number[],
  numberOfIndex: number,
  currIndex: number,
): FolderType => {
  if (currIndex === numberOfIndex - 1) {
    item.isOpen = !item.isOpen
    return item
  }
  const nextIndex = indexArr[currIndex + 1]
  let currItem = item.items[nextIndex] as FolderType
  const updatedItem = toggleVisibility(
    currItem,
    indexArr,
    numberOfIndex,
    currIndex + 1,
  )
  item.items[nextIndex] = updatedItem
  return item
}

const ChevronIconComponnent = ({ item }: { item: FolderType }) => {
  return (
    <span className="cursor-pointer">
      {item.isOpen ? (
        <ChevronDown size={20} strokeWidth={1} className="translate-y-0.5" />
      ) : (
        <ChevronRightIcon size={20} strokeWidth={1} className="translate-y-0.5" />
      )}
    </span>
  )
}

const AddFileFolderComponent = ({ item }: { item: FolderType }) => {
  const { setSelectedFolderForAdd } = useFolderStructureData()
  const handleSelect = (type: 'file' | 'folder') => {
    const data: SelectedFolderTypeForAdd = {
      id: item.id,
      fileType: type,
    }
    setSelectedFolderForAdd(data)
  }
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <File
        onClick={() => handleSelect('file')}
        size={13}
        className="cursor-pointer"
      />
      <Folder
        onClick={() => handleSelect('folder')}
        size={13}
        className="cursor-pointer"
      />
    </div>
  )
}

const refactorId = (
  item: (FolderType | FileType)[],
  criticalIndexVal: number,
  indexPosition: number,
): (FolderType | FileType)[] => {
  console.log(
    'item, criticalIndexVal, indexPosition = ',
    item,
    criticalIndexVal,
    indexPosition,
  )
  if (item.length === 0) {
    return item
  }
  for (let i = 0; i < item.length; i++) {
    const updatedId = item[i].id
      .split('.')
      .map((el, i) => {
        if (i === indexPosition && Number(el) >= criticalIndexVal) {
          return Number(el) - 1
        } else {
          return Number(el)
        }
      })
      .join('.')
    item[i].id = updatedId
    if (item[i].isFolder) {
      refactorId(
        (item[i] as FolderType)?.items,
        criticalIndexVal,
        indexPosition,
      )
    }
  }
  return item
}

const handleAddEditDeleteFileFolder = (
  item: FolderType,
  indexArr: number[],
  numberOfIndex: number,
  currIndex: number,
  action: 'edit' | 'add' | 'delete',
  inputVal?: string,
  fileType?: 'folder' | 'file',
  deleteItemId?: string,
): FolderType | null => {
  if (currIndex === numberOfIndex - 1) {
    if (action === 'add') {
      let newId =
        indexArr.join('.') + '.' + (item?.items?.length.toString() ?? '1')
      let newFileOrFolder: FileType | FolderType
      if (fileType === 'file') {
        newFileOrFolder = {
          id: newId,
          name: inputVal ?? '',
          isFolder: false,
        }
      } else {
        newFileOrFolder = {
          id: newId,
          isFolder: true,
          name: inputVal ?? '',
          isOpen: true,
          items: [],
        }
      }
      item.items.push(newFileOrFolder)
    } else if (action === 'edit') {
      item.name = inputVal ?? ''
    } else {
      console.log('item to delete = ', item)
      return null
    }
    return item
  }
  const nextIndex = indexArr[currIndex + 1]
  let currItem = item?.items[nextIndex] as FolderType
  const updatedItem = handleAddEditDeleteFileFolder(
    currItem,
    indexArr,
    numberOfIndex,
    currIndex + 1,
    action,
    inputVal,
    fileType,
    deleteItemId,
  )
  if (updatedItem) {
    item.items[nextIndex] = updatedItem
  } else {
    // console.log('nextIndex = ', nextIndex)
    // console.log('item.items[nextIndex] = ', item.items[nextIndex])
    const ItemsToRefactor = item.items.filter((item) => {
      console.log(item.id, deleteItemId)
      return item.id !== deleteItemId
    })
    const updatedItems = refactorId(ItemsToRefactor, nextIndex, currIndex + 1)
    item.items = updatedItems
    console.log('updated Items = ', updatedItems)
    // item.items
  }
  return item
}
const AddFileFolderInput = () => {
  const [inputVal, setInputVal] = useState('')
  const handleInputChange = (e: any) => {
    setInputVal(e.target.value)
  }
  const {
    updateFolderStructureData,
    folderStructureData,
    selectedFolderForAdd,
    setSelectedFolderForAdd,
  } = useFolderStructureData()
  let copyData = structuredClone(folderStructureData)
  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      const itemIndexArr =
        selectedFolderForAdd?.id.split('.').map((item) => Number(item)) ?? []
      const numberOfIndex = itemIndexArr?.length ?? 0
      const startFolder = copyData[itemIndexArr[0]] as FolderType
      const updatedFolder = handleAddEditDeleteFileFolder(
        startFolder,
        itemIndexArr,
        numberOfIndex,
        0,
        'add',
        inputVal,
        selectedFolderForAdd?.fileType as 'file' | 'folder',
      )
      if (updatedFolder) {
        copyData[itemIndexArr[0]] = updatedFolder
      }
      updateFolderStructureData(copyData)
      setSelectedFolderForAdd(null)
    } else return
  }
  return (
    <Input
      value={inputVal}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      className="h-6 rounded-none p-0 ml-[10%] w-[90%]"
      autoFocus
    />
  )
}

const RenderItems = ({ item }: { item: ItemType }) => {
  if (item.length === 0) {
    return null
  }
  const {
    selectedFolderForAdd,
    folderStructureData,
    updateFolderStructureData,
  } = useFolderStructureData()
  const sortedItem = item.sort((a, b) => {
    // 1. Sort by fileType: "folder" before "file"
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1
    }

    // 2. If types are the same, sort by fileName alphabetically
    return a.name.localeCompare(b.name, undefined, {
      numeric: true, // Sorts numbers naturally (e.g., "file2" before "file10")
      sensitivity: 'base', // Ignores case and accents
    })
  })

  const toggleOpen = (id: string) => {
    let copyData = structuredClone(folderStructureData)
    const itemIndexArr = id.split('.').map((item) => Number(item))
    const numberOfIndex = itemIndexArr.length
    const startFolder = copyData[itemIndexArr[0]] as FolderType
    const updatedFolder = toggleVisibility(
      startFolder,
      itemIndexArr,
      numberOfIndex,
      0,
    )
    copyData[itemIndexArr[0]] = updatedFolder
    updateFolderStructureData(copyData)
  }

  return (
    <div>
      {sortedItem.map((el) => {
        switch (el.isFolder) {
          //folder
          case true: {
            return (
              <div key={el.id}>
                <div className="flex items-center gap-1">
                  <div
                    onClick={() => toggleOpen(el.id)}
                    className="flex gap-1 items-center"
                  >
                    <ChevronIconComponnent item={el} />
                    <ItemComponent item={el} />
                  </div>
                  <AddFileFolderComponent item={el} />
                </div>
                {el.isOpen && (
                  <div className="ml-3 border-l">
                    <RenderItems item={el.items} />
                  </div>
                )}
                {el.id === selectedFolderForAdd?.id && <AddFileFolderInput />}
              </div>
            )
          }
          //file
          case false: {
            return (
              <div className="ml-4">
                <ItemComponent key={el.id} item={el} />
              </div>
            )
          }
        }
      })}
    </div>
  )
}

function RouteComponent() {
  const { folderStructureData } = useFolderStructureData()
  const copyfolderStructureData = structuredClone(folderStructureData)
  return (
    <div className="flex-1">
      <div className="max-w-xs border h-full">
        <RenderItems item={copyfolderStructureData as ItemType} />
      </div>
    </div>
  )
}

// [
//   {
//     "id": "0",
//     "name": "route",
//     "isFolder": true,
//     "items": [
//       {
//         "id": "0.0",
//         "name": "design-pattern",
//         "isFolder": true,
//         "items": [],
//         "isOpen": true
//       },
//       {
//         "id": "0.1",
//         "name": "file manager",
//         "isFolder": true,
//         "items": [
//           {
//             "id": "0.1.0",
//             "name": "index.tsx",
//             "isFolder": false
//           }
//         ],
//         "isOpen": true
//       }
//     ],
//     "isOpen": true
//   }
// ]
