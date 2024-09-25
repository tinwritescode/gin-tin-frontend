import { create } from "zustand";
import { BaseKey } from "@refinedev/core";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface List {
  id: BaseKey;
  name: string;
  tasks: Task[];
}

interface Stats {
  completed: number;
  total: number;
}

interface Settings {
  vozNewsRecommendations: boolean;
  linkedinRecommendations: boolean;
  topGithubRepositories: boolean;
}

interface TodoState {
  selectedList: BaseKey | null;
  editingTask: Task | null;
  editingListId: BaseKey | null;
  stats: Stats;
  completionMode: boolean;
  showSettings: boolean;
  settings: Settings;
  setShowSettings: (showSettings: boolean) => void;
  startEditListName: (listId: BaseKey | null) => void;
  saveListName: (listName: string) => void;
  addTask: (taskText: string) => void;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  startEditTask: (taskId: number | null) => void;
  saveEditTask: (taskText: string) => void;
  toggleCompletionMode: () => void;
  toggleSetting: (setting: keyof Settings) => void;
  setSelectedList: (listId: BaseKey | null) => void;
  updateStats: () => void;
}

const shouldResetTasks = (): boolean => {
  const lastReset = localStorage.getItem("lastReset");
  const today = new Date().toDateString();
  if (lastReset !== today) {
    localStorage.setItem("lastReset", today);
    return true;
  }
  return false;
};

export const useTodoStore = create<TodoState>()((set, get) => ({
  selectedList: null,
  editingTask: null,
  editingListId: null,
  stats: { completed: 0, total: 0 },
  completionMode: false,
  showSettings: false,
  setShowSettings: (showSettings: boolean) => {
    set({ showSettings });
  },
  settings: {
    vozNewsRecommendations: false,
    linkedinRecommendations: false,
    topGithubRepositories: false,
  },
  startEditListName: (listId: BaseKey | null) => {
    set({ editingListId: listId });
  },
  saveListName: (listName: string) => {
    if (listName.trim()) {
      set((state) => ({
        editingListId: null,
      }));
    }
  },
  addTask: (taskText: string) => {
    if (taskText.trim()) {
      set((state) => ({
        // Logic for adding a task
      }));
      get().updateStats();
    }
  },
  toggleTask: (taskId: number) => {
    set((state) => ({
      // Logic for toggling a task
    }));
    get().updateStats();
  },
  deleteTask: (taskId: number) => {
    set((state) => ({
      // Logic for deleting a task
    }));
    get().updateStats();
  },
  startEditTask: (taskId: number | null) => {
    // Logic for starting to edit a task
  },
  saveEditTask: (taskText: string) => {
    // Logic for saving edited task
    get().updateStats();
  },
  toggleCompletionMode: () => {
    set((state) => ({ completionMode: !state.completionMode }));
  },
  toggleSetting: (setting: keyof Settings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [setting]: !state.settings[setting],
      },
    }));
  },
  setSelectedList: (listId: BaseKey | null) => {
    set({ selectedList: listId });
    if (listId !== null) {
      get().updateStats();
    }
  },
  updateStats: () => {
    // Only update stats if a list is selected
    if (get().selectedList !== null) {
      // Logic for updating stats
    }
  },
}));

if (shouldResetTasks()) {
  useTodoStore.setState((state) => ({
    // Logic for resetting tasks
  }));
}
