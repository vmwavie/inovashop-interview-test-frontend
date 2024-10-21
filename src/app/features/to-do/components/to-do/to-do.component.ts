import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.sass'],
  standalone: true,
  imports: [CommonModule],
})
export class todoComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  page = 1;
  currentPage = 1;
  totalPages = 10;

  tasks = [
    {
      id: 1,
      name: 'Jogging',
      time: '06:00 - 07:30',
      completed: true,
      showDropdown: false,
    },
    {
      id: 2,
      name: 'Read a book',
      time: '08:00 - 09:00',
      completed: false,
      showDropdown: false,
    },
    {
      id: 3,
      name: 'Wireframing new product',
      time: '09:00 - 11:00',
      completed: true,
      showDropdown: false,
    },
    {
      id: 4,
      name: 'Moodboard Landing Page',
      time: '11:00 - 13:00',
      completed: false,
      showDropdown: false,
    },
    {
      id: 5,
      name: 'Weekly meeting',
      time: '13:00 - 14:00',
      completed: true,
      showDropdown: false,
    },
    {
      id: 6,
      name: 'Design PPT for Sharing Session #2',
      time: '14:00 - 16:00',
      completed: false,
      showDropdown: false,
    },
    {
      id: 7,
      name: 'Ngopi with Bojo',
      time: '17:00 - 18:30',
      completed: true,
      showDropdown: false,
    },
    {
      id: 8,
      name: 'Watch Netflix - Vinland Saga',
      time: '19:00 - 20:00',
      completed: false,
      showDropdown: false,
    },
  ];

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPageRange(): (number | string)[] {
    const range: (number | string)[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        range.push(1, 2, 3, 4, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        range.push(
          1,
          '...',
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        );
      } else {
        range.push(
          1,
          '...',
          this.currentPage - 1,
          this.currentPage,
          this.currentPage + 1,
          '...',
          this.totalPages
        );
      }
    }
    return range;
  }

  toggleDropdown(taskId: number) {
    this.tasks = this.tasks.map(task =>
      task.id === taskId
        ? { ...task, showDropdown: !task.showDropdown }
        : { ...task, showDropdown: false }
    );
  }

  editTask(taskId: number) {
    console.log('Edit task', taskId);
  }

  deleteTask(taskId: number) {
    console.log('Delete task', taskId);
  }

  completeTask(task: {
    id: number;
    completed: boolean;
    name: string;
    showDropdown: boolean;
    time: string;
  }) {
    this.tasks = this.tasks.map(item =>
      item.id === task.id ? { ...item, completed: !task.completed } : item
    );
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', event => {
          const target = event.target as HTMLInputElement;
          const svg = target.nextElementSibling as SVGElement;
          if (target.checked) {
            svg.classList.remove('hidden');
          } else {
            svg.classList.add('hidden');
          }
        });
      });
    }
  }
}
