import { CheckCircledIcon, GearIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";
import { useList, useOne, useUpdate } from "@refinedev/core";
import React, { useEffect, useLayoutEffect } from "react";
import { AddTaskForm } from "./AddTaskForm";
import { Dashboard } from "./Dashboard";
import { Settings } from "./Settings";
import { TaskList } from "./TaskList";
import { useTodoStore } from "../../../store/todoStore";

export function MainContent() {
  const [showSettings, setShowSettings] = React.useState(false);
  const [completionMode, setCompletionMode] = React.useState(false);
  const { selectedList, setSelectedList } = useTodoStore();

  const { data: todolistsData } = useList({ resource: "todolists" });
  const { data: selectedTodolistData } = useOne({
    resource: "todolists",
    id: selectedList as NonNullable<typeof selectedList>,
    queryOptions: {
      enabled: !!selectedList,
    },
  });

  useLayoutEffect(() => {
    if (todolistsData && !selectedList) {
      const listId = todolistsData.data?.[0]?.id;
      if (listId) {
        setSelectedList(listId);
      }
    }
  }, [todolistsData]);

  const toggleCompletionMode = () => {
    setCompletionMode(!completionMode);
  };

  const selectedTodolistName = selectedTodolistData?.data?.name || "Tasks";

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{selectedTodolistName}</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCompletionMode}
            className={`px-4 py-2 rounded ${
              completionMode
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            } transition-colors`}
            aria-label={
              completionMode
                ? "Disable completion mode"
                : "Enable completion mode"
            }
          >
            <CheckCircledIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-2 rounded ${
              showSettings
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } transition-colors`}
            aria-label={showSettings ? "Hide settings" : "Show settings"}
          >
            <GearIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSettings && <Settings />}

      {selectedTodolistData?.data?.id ? (
        <>
          <AddTaskForm todolistId={selectedTodolistData?.data?.id} />
          <TaskList
            todolistId={selectedTodolistData?.data?.id}
            completionMode={completionMode}
          />
          <Dashboard todolistId={selectedTodolistData?.data?.id} />
        </>
      ) : (
        <Text color="gray">No todolist selected</Text>
      )}
    </div>
  );
}
