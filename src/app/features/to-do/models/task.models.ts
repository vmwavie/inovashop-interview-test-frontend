interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number | string;
  showDropdown?: boolean;
  created_at: string;
}

export type { Task };
