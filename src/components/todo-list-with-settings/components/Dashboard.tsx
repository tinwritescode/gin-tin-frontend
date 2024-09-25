import React from "react";
import { BaseKey, useList } from "@refinedev/core";

export function Dashboard({ todolistId }: { todolistId: BaseKey }) {
  const { data: tasksData, isLoading } = useList({
    resource: `todolists/${todolistId}/items`,
    filters: [{ field: "todolistId", operator: "eq", value: todolistId }],
  });

  if (isLoading) return <div>Loading dashboard...</div>;

  const completedTasks =
    tasksData?.data.filter((task) => task.completed).length || 0;
  const totalTasks = tasksData?.data.length || 0;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Task Completion Dashboard</h2>
      <p>Completed Tasks: {completedTasks}</p>
      <p>Total Tasks: {totalTasks}</p>
      <p>Completion Rate: {completionRate.toFixed(2)}%</p>
    </div>
  );
}
