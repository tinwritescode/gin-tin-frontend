import React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { useList, useUpdate, useDelete, BaseKey } from "@refinedev/core";
import { Text } from "@radix-ui/themes";
import { cn } from "../../../lib/utils";

interface TaskListProps {
  todolistId: BaseKey;
  completionMode: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  todolistId,
  completionMode,
}) => {
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);

  const { data: tasksData, isLoading } = useList({
    resource: `todolists/${todolistId}/items`,
    filters: [
      {
        field: "todolistId",
        operator: "eq",
        value: todolistId,
      },
    ],
  });

  const { mutate: updateTask } = useUpdate();
  const { mutate: deleteTask } = useDelete();

  const handleToggleTask = (taskId: string) => {
    updateTask({
      resource: `todolists/${todolistId}/items`,
      id: taskId,
      values: {
        completed: !tasksData?.data.find((task) => task.id === taskId)
          ?.completed,
      },
    });
  };

  const handleEditTask = (taskId: string, newTitle: string) => {
    updateTask({
      resource: `todolists/${todolistId}/items`,
      id: taskId,
      values: { title: newTitle },
    });
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask({
      resource: `todolists/${todolistId}/items`,
      id: taskId,
    });
  };

  if (isLoading) return <div>Loading tasks...</div>;

  const length = tasksData?.data.length ?? null;

  return (
    <ul className="space-y-2">
      {length !== null && length > 0 ? (
        tasksData?.data.map((task) => {
          const taskId = task.id as string;
          if (!taskId) return null;

          return (
            <li
              key={taskId}
              className="flex items-center bg-white p-3 rounded shadow"
            >
              <Checkbox.Root
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(taskId)}
                className="w-5 h-5 mr-2 flex items-center justify-center border rounded"
              >
                <Checkbox.Indicator>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {editingTaskId === taskId ? (
                <input
                  type="text"
                  defaultValue={task.title}
                  onBlur={(e) => handleEditTask(taskId, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleEditTask(taskId, e.currentTarget.value);
                    if (e.key === "Escape") setEditingTaskId(null);
                  }}
                  className="flex-1 px-2 py-1 border rounded mr-2"
                  autoFocus
                />
              ) : (
                <span
                  className={cn(
                    "flex-1",
                    task.completed ? "line-through text-gray-500" : "",
                    completionMode ? "cursor-pointer" : "",
                    task.title?.length > 0 ? "" : "italic text-gray-200"
                  )}
                  onClick={() => !completionMode && setEditingTaskId(taskId)}
                >
                  {task.title?.length > 0 ? task.title : "No title"}
                </span>
              )}
              {!completionMode && (
                <button
                  onClick={() => handleDeleteTask(taskId)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </li>
          );
        })
      ) : (
        <Text>No tasks found</Text>
      )}
    </ul>
  );
};
