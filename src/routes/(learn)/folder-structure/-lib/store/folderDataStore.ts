import { create } from 'zustand'
import type { ItemType } from '../type'
import data from '../data.json'

export type SelectedFolderTypeForAdd = {
  id: string
  fileType: 'file' | 'folder'
}
export type SelectedFolderTypeForEditDelete = {
  id: string
  action: 'edit' | 'delete'
}

type State = {
  folderStructureData: ItemType
  updateFolderStructureData: (data: ItemType) => void
  selectedFolderForAdd: SelectedFolderTypeForAdd | null
  setSelectedFolderForAdd: (data: SelectedFolderTypeForAdd | null) => void
  selectedIdForEditDelete: SelectedFolderTypeForEditDelete | null
  setSelectedIdForEditDelete: (data: SelectedFolderTypeForEditDelete | null) => void
}

// Create your store, which includes both state and (optionally) actions
export const useFolderStructureData = create<State>((set) => ({
  folderStructureData: data as ItemType,
  updateFolderStructureData: (updatedData: ItemType) =>
    set({ folderStructureData: updatedData }),
  selectedFolderForAdd: null,
  setSelectedFolderForAdd: (data) => set({ selectedFolderForAdd: data }),
  selectedIdForEditDelete: null,
  setSelectedIdForEditDelete: (data) => set({ selectedIdForEditDelete: data }),
}))
