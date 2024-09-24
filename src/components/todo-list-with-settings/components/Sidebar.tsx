import React from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTodoStore } from "../../../store/todoStore";

export function Sidebar() {
  const {
    lists,
    selectedList,
    editingListId,
    addList,
    startEditListName,
    saveListName,
    setSelectedList,
  } = useTodoStore();

  const handleListNameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    listId: number
  ): void => {
    if (e.key === "Enter") {
      saveListName((e.target as HTMLInputElement).value);
    } else if (e.key === "Escape") {
      startEditListName(null);
    }
  };

  return (
    <div className="w-64 bg-white p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Lists</h2>
      <ul>
        {lists.map((list) => (
          <li
            key={list.id}
            className={`cursor-pointer p-2 rounded ${
              selectedList === list.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedList(list.id)}
            onDoubleClick={() => startEditListName(list.id)}
          >
            {editingListId === list.id ? (
              <input
                type="text"
                defaultValue={list.name}
                onBlur={(e) => saveListName(e.target.value)}
                onKeyDown={(e) => handleListNameKeyDown(e, list.id)}
                className="w-full px-2 py-1 border rounded"
                autoFocus
              />
            ) : (
              list.name
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={addList}
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <PlusIcon className="mr-2" /> New List
      </button>
    </div>
  );
}
