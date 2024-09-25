import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useTodoStore } from "../../../store/todoStore";
import { BaseKey, useCreate, useList, useDelete } from "@refinedev/core";
import { Button, Reset, Theme } from "@radix-ui/themes";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function Sidebar() {
  const {
    selectedList,
    editingListId,
    startEditListName,
    saveListName,
    setSelectedList,
  } = useTodoStore();
  const { data } = useList({ resource: "todolists" });
  const { mutate: create } = useCreate({
    resource: "todolists",
    values: {
      title: "New List",
    },
  });
  const { mutate: deleteList } = useDelete();
  const lists = data?.data;

  const [listToDelete, setListToDelete] = useState<BaseKey | null>(null);

  const handleListNameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    listId: BaseKey
  ): void => {
    if (e.key === "Enter") {
      saveListName((e.target as HTMLInputElement).value);
    } else if (e.key === "Escape") {
      startEditListName(null);
    }
  };

  const handleDeleteList = (listId: BaseKey) => {
    deleteList({
      resource: "todolists",
      id: listId,
    });
    if (selectedList === listId) {
      setSelectedList(null);
    }
    setListToDelete(null);
  };

  return (
    <div className="w-64 bg-white p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Lists</h2>
      {lists && (
        <ul>
          {lists.map((list) => {
            const listId = list.id;
            if (!listId) return null;

            return (
              <li
                key={list.id}
                className={`cursor-pointer p-2 rounded flex justify-between items-center ${
                  selectedList === list.id ? "bg-blue-100" : ""
                }`}
              >
                <div
                  onClick={() => setSelectedList(listId)}
                  onDoubleClick={() => startEditListName(listId)}
                  className="flex-grow"
                >
                  {editingListId === listId ? (
                    <input
                      type="text"
                      defaultValue={list.name}
                      onBlur={(e) => saveListName(e.target.value)}
                      onKeyDown={(e) => handleListNameKeyDown(e, listId)}
                      className="w-full px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    list.title
                  )}
                </div>

                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button
                      onClick={() => setListToDelete(listId)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <TrashIcon />
                    </button>
                  </AlertDialog.Trigger>

                  <Theme>
                    <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
                    <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                      <AlertDialog.Title className="text-lg font-bold mb-2">
                        Are you sure?
                      </AlertDialog.Title>
                      <AlertDialog.Description className="mb-4">
                        This action cannot be undone. This will permanently
                        delete the list and all its tasks.
                      </AlertDialog.Description>
                      <Theme>
                        <div className="flex justify-end space-x-2">
                          <AlertDialog.Cancel asChild>
                            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                              Cancel
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <Button
                              onClick={() => handleDeleteList(listId)}
                              color="red"
                              variant="solid"
                            >
                              Yes, delete list
                            </Button>
                          </AlertDialog.Action>
                        </div>
                      </Theme>
                    </AlertDialog.Content>
                  </Theme>
                </AlertDialog.Root>
              </li>
            );
          })}
        </ul>
      )}

      <Button onClick={() => create()} className="w-full" size="3">
        <PlusIcon className="mr-2" /> New List
      </Button>
    </div>
  );
}
