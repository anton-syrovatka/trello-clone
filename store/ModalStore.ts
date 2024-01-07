import { TaskStatus } from "@/typings";
import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  newTaskTitle: string;
  setNewTaskTitle: (text: string) => void;

  newTaskStatus: TaskStatus;
  setNewTaskStatus: (columnId: TaskStatus) => void;

  image: File | null;
  setImage: (image: File | null) => void;

  clearTaskState: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  newTaskTitle: "",
  setNewTaskTitle: (text: string) => {
    set({ newTaskTitle: text });
  },

  newTaskStatus: "todo",
  setNewTaskStatus: (columnId: TaskStatus) => set({ newTaskStatus: columnId }),

  image: null,
  setImage: (image: File | null) => set({ image }),

  clearTaskState: () => {
    set({
      newTaskTitle: "",
      image: null,
    });
  },
}));
