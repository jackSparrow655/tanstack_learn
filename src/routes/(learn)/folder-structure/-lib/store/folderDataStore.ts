import { create } from 'zustand'
import type { ItemType } from '../type'
import data from '../data.json'

export type SelectedFolderType = {
  id: string
  fileType: 'file' | 'folder'
}

type State = {
  folderStructureData: ItemType
  updateFolderStructureData: (data: ItemType) => void
  selectedFolder: SelectedFolderType | null
  setSelectedFolder: (data: SelectedFolderType | null) => void
  selectedIdForEditDelete: string | null
  setSelectedIdForEditDelete: (id: string | null) => void
}

// Create your store, which includes both state and (optionally) actions
export const useFolderStructureData = create<State>((set) => ({
  folderStructureData: data as ItemType,
  updateFolderStructureData: (updatedData: ItemType) =>
    set({ folderStructureData: updatedData }),
  selectedFolder: null,
  setSelectedFolder: (data) => set({ selectedFolder: data }),
  selectedIdForEditDelete: null,
  setSelectedIdForEditDelete: (id) => set({ selectedIdForEditDelete: id }),
}))
