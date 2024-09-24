import React from "react";
import { CheckCircledIcon, GearIcon } from "@radix-ui/react-icons";
import { useTodoStore } from "../../../store/todoStore";
import { Settings } from "./Settings";
import { AddTaskForm } from "./AddTaskForm";
import { TaskList } from "./TaskList";
import { Dashboard } from "./Dashboard";

export function MainContent() {
  const {
    lists,
    selectedList,
    completionMode,
    showSettings,
    toggleCompletionMode,
    setShowSettings,
  } = useTodoStore();

  const selectedListName =
    lists.find((list) => list.id === selectedList)?.name || "Tasks";

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{selectedListName}</h1>
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
      <AddTaskForm />
      <TaskList />
      <Dashboard />
    </div>
  );
}
