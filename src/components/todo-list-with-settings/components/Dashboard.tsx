import React from "react";
import { useTodoStore } from "../../../store/todoStore";

export function Dashboard() {
  const { stats } = useTodoStore();

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Task Completion Dashboard</h2>
      <p>Completed Tasks: {stats.completed}</p>
      <p>Total Tasks: {stats.total}</p>
      <p>
        Completion Rate:{" "}
        {stats.total > 0
          ? ((stats.completed / stats.total) * 100).toFixed(2)
          : 0}
        %
      </p>
    </div>
  );
}
