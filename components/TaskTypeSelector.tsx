"use client";

import { RadioGroup } from "@headlessui/react";
import { useBoardStore } from "@/store/BoardStore";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { TaskStatus } from "@/typings";

const types = [
  {
    id: "todo",
    name: "Todo",
    description: "A new task to be completed",
    color: "bg-yellow-500",
  },
  {
    id: "in-progress",
    name: "In Progress",
    description: "A task that is currently being worked on",
    color: "bg-blue-500",
  },
  {
    id: "done",
    name: "Done",
    description: "A task that has been completed",
    color: "bg-green-500",
  },
];

type Props = {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
};

function TaskStatusSelector({ value, onChange }: Props) {
  const getClassesForActive = (active: boolean) =>
    active
      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
      : "";
  const getClassesForChecked = (checked: boolean, color: string) =>
    checked ? `${color} bg-opacity-75 text-white` : "bg-white";

  const getClassesForOption =
    (color: string) =>
    ({ active, checked }: { active: boolean; checked: boolean }) => {
      return [
        getClassesForActive(active),
        getClassesForChecked(checked, color),
        "relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none",
      ].join(" ");
    };

  return (
    <div className="w-full py-5">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={value} onChange={onChange}>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={getClassesForOption(type.color)}
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex item-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-white" : "text-gray-500"
                            }`}
                          >
                            <span>{type.description}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default TaskStatusSelector;
