import { MainContent } from "./todo-list-with-settings/components/MainContent";
import { Sidebar } from "./todo-list-with-settings/components/Sidebar";

export function TodoListWithSettings() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MainContent />
    </div>
  );
}
