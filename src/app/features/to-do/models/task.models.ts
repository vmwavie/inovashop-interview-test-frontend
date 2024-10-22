interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number | string;
  showDropdown?: boolean;
  created_at: string;
  last_updated?: string;
}

export type { Task };
