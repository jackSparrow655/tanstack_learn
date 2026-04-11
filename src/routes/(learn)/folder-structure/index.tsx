import { createFileRoute } from '@tanstack/react-router'
import type { FileType, FolderType, Item, ItemType } from './-lib/type'
import { ChevronDown, ChevronRightIcon, File, Folder } from 'lucide-react'
import {
  useFolderStructureData,
  type SelectedFolderType,
} from './-lib/store/folderDataStore'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export const Route = createFileRoute('/(learn)/folder-structure/')({
  component: RouteComponent,
})

const ItemComponent = ({ item }: { item: Item }) => {
  return <span>{item.name}</span>
}

const toggleVisibility = (
  item: FolderType,
  indexArr: number[],
  numberOfIndex: number,
  currIndex: number,
): FolderType => {
  if (currIndex === numberOfIndex-1) {
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
  const { updateFolderStructureData, folderStructureData } =
    useFolderStructureData()
  let copyData = structuredClone(folderStructureData)
  const toggleOpen = () => {
    const itemIndexArr = item.id.split('.').map((item) => Number(item))
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
    <span onClick={toggleOpen} className="cursor-pointer">
      {item.isOpen ? <ChevronDown /> : <ChevronRightIcon />}
    </span>
  )
}

const AddFileFolderComponent = ({ item }: { item: FolderType }) => {
  const { setSelectedFolder } = useFolderStructureData()
  const handleSelect = (type: 'file' | 'folder') => {
    const data: SelectedFolderType = {
      id: item.id,
      fileType: type,
    }
    console.log('data = ', data)
    setSelectedFolder(data)
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

const handleAddFileFolder = (
  item: FolderType,
  indexArr: number[],
  numberOfIndex: number,
  currIndex: number,
  inputVal: string,
  fileType: 'folder' | 'file',
): FolderType => {
  if (currIndex === numberOfIndex -1) {
    let newId =
      indexArr.join('.') + '.' + (item?.items?.length.toString() ?? '1')
    let newFileOrFolder: FileType | FolderType
    if (fileType === 'file') {
      newFileOrFolder = {
        id: newId,
        name: inputVal,
        isFolder: false,
      }
    } else {
      newFileOrFolder = {
        id: newId,
        isFolder: true,
        name: inputVal,
        isOpen: true,
        items: [],
      }
    }
    console.log('item.items.push', item)
    item.items.push(newFileOrFolder)
    return item
  }
  const nextIndex = indexArr[currIndex + 1]
  let currItem = item?.items[nextIndex] as FolderType
  const updatedItem = handleAddFileFolder(
    currItem,
    indexArr,
    numberOfIndex,
    currIndex + 1,
    inputVal,
    fileType,
  )
  item.items[nextIndex] = updatedItem
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
    selectedFolder,
    setSelectedFolder,
  } = useFolderStructureData()
  let copyData = structuredClone(folderStructureData)
  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      const itemIndexArr =
        selectedFolder?.id.split('.').map((item) => Number(item)) ?? []
      const numberOfIndex = itemIndexArr?.length ?? 0
      const startFolder = copyData[itemIndexArr[0]] as FolderType
      const updatedFolder = handleAddFileFolder(
        startFolder,
        itemIndexArr,
        numberOfIndex,
        0,
        inputVal,
        selectedFolder?.fileType as 'file' | 'folder',
      )
      copyData[itemIndexArr[0]] = updatedFolder
      updateFolderStructureData(copyData)
      console.log('updated = ', copyData)
      setSelectedFolder(null)
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
  const { selectedFolder } = useFolderStructureData()
  console.log('selected folder = ', selectedFolder)
  // const sortedItem = item.sort((a, b) => {
  //   // 1. Sort by fileType: "folder" before "file"
  //   if (a.isFolder !== b.isFolder) {
  //     return a.isFolder ? -1 : 1
  //   }

  //   // 2. If types are the same, sort by fileName alphabetically
  //   return a.name.localeCompare(b.name, undefined, {
  //     numeric: true, // Sorts numbers naturally (e.g., "file2" before "file10")
  //     sensitivity: 'base', // Ignores case and accents
  //   })
  // })
  return (
    <div>
      {item.map((el) => {
        switch (el.isFolder) {
          //folder
          case true: {
            return (
              <div key={el.id}>
                <div className="flex items-center gap-1">
                  <ChevronIconComponnent item={el} />
                  <ItemComponent item={el} />
                  <AddFileFolderComponent item={el} />
                </div>
                {el.isOpen && (
                  <div className="pl-3">
                    <RenderItems item={el.items} />
                  </div>
                )}
                {el.id === selectedFolder?.id && <AddFileFolderInput />}
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
  return (
    <div className="flex-1">
      <div className="max-w-xs border h-full">
        <RenderItems item={folderStructureData as ItemType} />
      </div>
    </div>
  )
}
