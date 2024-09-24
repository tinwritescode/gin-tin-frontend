import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { useTodoStore } from "../../../store/todoStore";

export function TaskList() {
  const {
    selectedList,
    lists,
    editingTask,
    completionMode,
    toggleTask,
    startEditTask,
    saveEditTask,
    deleteTask,
  } = useTodoStore();

  const selectedListTasks =
    lists.find((list) => list.id === selectedList)?.tasks || [];

  const handleEditTaskKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    taskId: number
  ) => {
    if (e.key === "Enter") {
      saveEditTask((e.target as HTMLInputElement).value);
    } else if (e.key === "Escape") {
      startEditTask(null);
    }
  };

  return (
    <ul className="space-y-2">
      {selectedListTasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center bg-white p-3 rounded shadow"
        >
          <Checkbox.Root
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="w-5 h-5 mr-2 flex items-center justify-center border rounded"
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          {editingTask && editingTask.id === task.id ? (
            <input
              type="text"
              defaultValue={task.text}
              onBlur={(e) => saveEditTask(e.target.value)}
              onKeyDown={(e) => handleEditTaskKeyDown(e, task.id)}
              className="flex-1 px-2 py-1 border rounded mr-2"
              autoFocus
            />
          ) : (
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-gray-500" : ""
              } ${completionMode ? "cursor-pointer" : ""}`}
              onClick={() => startEditTask(task.id)}
            >
              {task.text}
            </span>
          )}
          {!completionMode && (
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
