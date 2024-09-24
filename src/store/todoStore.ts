import { create } from "zustand";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface List {
  id: number;
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
  lists: List[];
  selectedList: number;
  editingTask: Task | null;
  editingListId: number | null;
  stats: Stats;
  completionMode: boolean;
  showSettings: boolean;
  settings: Settings;
  setShowSettings: (showSettings: boolean) => void;
  addList: () => void;
  startEditListName: (listId: number | null) => void;
  saveListName: (listName: string) => void;
  addTask: (taskText: string) => void;
  toggleTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  startEditTask: (taskId: number | null) => void;
  saveEditTask: (taskText: string) => void;
  toggleCompletionMode: () => void;
  toggleSetting: (setting: keyof Settings) => void;
  setSelectedList: (listId: number) => void;
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
  lists: [{ id: 1, name: "Default List", tasks: [] }],
  selectedList: 1,
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
  addList: () => {
    const newList: List = {
      id: Date.now(),
      name: `New List ${get().lists.length + 1}`,
      tasks: [],
    };
    set((state) => ({
      lists: [...state.lists, newList],
      selectedList: newList.id,
    }));
  },
  startEditListName: (listId: number | null) => {
    set({ editingListId: listId });
  },
  saveListName: (listName: string) => {
    if (listName.trim()) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === state.editingListId
            ? { ...list, name: listName.trim() }
            : list
        ),
        editingListId: null,
      }));
    }
  },
  addTask: (taskText: string) => {
    if (taskText.trim()) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === state.selectedList
            ? {
                ...list,
                tasks: [
                  ...list.tasks,
                  { id: Date.now(), text: taskText, completed: false },
                ],
              }
            : list
        ),
      }));
      get().updateStats();
    }
  },
  toggleTask: (taskId: number) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === state.selectedList
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : list
      ),
    }));
    get().updateStats();
  },
  deleteTask: (taskId: number) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === state.selectedList
          ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
          : list
      ),
    }));
    get().updateStats();
  },
  startEditTask: (taskId: number | null) => {
    if (!get().completionMode) {
      const selectedList = get().lists.find(
        (list) => list.id === get().selectedList
      );
      const taskToEdit =
        taskId !== null
          ? selectedList?.tasks.find((task) => task.id === taskId) || null
          : null;
      set({ editingTask: taskToEdit });
    } else if (taskId !== null) {
      get().toggleTask(taskId);
    }
  },
  saveEditTask: (taskText: string) => {
    if (get().editingTask && taskText.trim()) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === state.selectedList
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === state.editingTask!.id
                    ? { ...task, text: taskText.trim() }
                    : task
                ),
              }
            : list
        ),
        editingTask: null,
      }));
      get().updateStats();
    }
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
  setSelectedList: (listId: number) => {
    set({ selectedList: listId });
    get().updateStats();
  },
  updateStats: () => {
    const selectedListTasks =
      get().lists.find((list) => list.id === get().selectedList)?.tasks || [];
    const completed = selectedListTasks.filter((task) => task.completed).length;
    const total = selectedListTasks.length;
    set({ stats: { completed, total } });
  },
}));

if (shouldResetTasks()) {
  useTodoStore.setState((state) => ({
    lists: state.lists.map((list) => ({
      ...list,
      tasks: list.tasks.map((task) => ({ ...task, completed: false })),
    })),
  }));
}
