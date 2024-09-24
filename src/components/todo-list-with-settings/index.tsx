import { MainContent } from "./components/MainContent";
import { Sidebar } from "./components/Sidebar";

export function TodoListWithSettings() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <MainContent />
    </div>
  );
}
