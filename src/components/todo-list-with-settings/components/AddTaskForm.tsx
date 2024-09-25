import React from "react";
import { BaseKey, useCreate } from "@refinedev/core";

interface AddTaskFormProps {
  todolistId: BaseKey;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ todolistId }) => {
  const { mutate: createTask } = useCreate();
  const [title, setTitle] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask({
      resource: `todolists/${todolistId}/items`,
      values: {
        title,
        todolistId,
        completed: false,
      },
    });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task"
        className="w-full px-3 py-2 border rounded"
      />
    </form>
  );
};
