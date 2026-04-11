export type ItemType = (FolderType | FileType)[]

export interface FolderType extends Item {
  isFolder: true
  items: (FolderType | FileType)[],
  isOpen:boolean
}

export interface FileType extends Item {
  isFolder: false
}

export interface Item {
  id: string
  name: string
}
