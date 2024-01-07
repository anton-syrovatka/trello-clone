"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { TaskStatus } from "@/typings";
import TaskTypeSelector from "./TaskTypeSelector";

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [
    image,
    setImage,
    newTaskTitle,
    setNewTaskTitle,
    newTaskStatus,
    setNewTaskStatus,
    clearTaskState,
  ] = useModalStore((state) => [
    state.image,
    state.setImage,
    state.newTaskTitle,
    state.setNewTaskTitle,
    state.newTaskStatus,
    state.setNewTaskStatus,
    state.clearTaskState,
  ]);

  const [createTask] = useBoardStore((state) => [state.createTask]);

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const handleTaskTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewTaskTitle(e.target.value);

  const handleNewTaskStatus = (value: TaskStatus) => {
    console.log(value);
    setNewTaskStatus(value);
  };

  const handleUploadImageClick = () => {
    imagePickerRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files![0].type.startsWith("image/")) {
      return;
    }
    setImage(e.target.files![0]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTaskTitle) {
      return;
    }

    createTask(newTaskTitle, newTaskStatus, image).then(() => clearTaskState());
    closeModal();
  };

  const handleCloseModal = () => {
    closeModal();
    clearTaskState();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6
                  text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add Task
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={handleTaskTitleChange}
                    placeholder="Enter a task here ..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>

                <TaskTypeSelector
                  value={newTaskStatus}
                  onChange={handleNewTaskStatus}
                />

                <div>
                  <button
                    type="button"
                    onClick={handleUploadImageClick}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                      focus-visible: ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>

                  {image && (
                    <Image
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      onClick={(e) => setImage(null)}
                      src={URL.createObjectURL(image)}
                      className="2-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150
                        cursor-not-allowed"
                    />
                  )}

                  <input
                    type="file"
                    ref={imagePickerRef}
                    onChange={handleFileChange}
                    hidden
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!newTaskTitle}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                      text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-node focus-visible:ring-2
                      focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100
                      disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
