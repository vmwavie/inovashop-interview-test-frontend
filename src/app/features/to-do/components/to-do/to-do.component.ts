/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  HostListener,
} from '@angular/core';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { Subscription } from 'rxjs';
import { TaskWebSocketService } from '../../services/to-do.websocket';
import { Task } from '../../models/task.models';
import { ToDoService } from '../../services/to-do.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.sass'],
})
export class TodoComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private taskWebSocketService: TaskWebSocketService,
    private todoService: ToDoService
  ) {}
  @ViewChild(TaskModalComponent) taskModal!: TaskModalComponent;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  page = 1;
  currentPage = 1;
  totalPages = 0;
  perPage = '10';
  showFilters = false;
  user_name = '';
  sortBy = '';

  private taskSubscription: Subscription | undefined;

  tasks: Task[] = [];

  getAllTasks(page: number, perPage: string, sortBy?: string | undefined) {
    this.todoService.getAllTasks(page, perPage, sortBy).subscribe(
      response => {
        console.log({ response });

        if (
          response.totalCount >= 1 &&
          this.currentPage > 1 &&
          this.tasks.length === 0
        ) {
          this.currentPage = this.currentPage - 1;
          this.getAllTasks(this.currentPage, this.perPage);
        }

        this.tasks = response.tasks.map((task: any) => ({
          ...task,
          showDropdown: false,
        }));

        this.totalPages = response.totalPages;
      },
      error => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  closeAllDropdowns() {
    this.tasks = this.tasks.map(task => ({ ...task, showDropdown: false }));
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.closeAllDropdowns();
  }

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      this.user_name = user.name || '';
    }

    this.getAllTasks(1, this.perPage);
    this.taskSubscription = this.taskWebSocketService.getTasks().subscribe(
      message => {
        console.log('Received message:', message);

        if (
          message.type === 'taskCreated' &&
          this.tasks.length < Number(this.perPage)
        ) {
          message.data.showDropdown = false;
          this.tasks.push(message.data);
        } else if (message.type === 'taskUpdated') {
          const index = this.tasks.findIndex(
            task => task.id === message.data.id
          );

          if (index !== -1) {
            this.tasks[index] = message.data;
          }
        } else if (message.type === 'taskDeleted') {
          const index = this.tasks.findIndex(task => task.id === message.data);
          if (index !== -1) {
            this.tasks.splice(index, 1);
          }
        }
      },
      error => console.error('Error:', error)
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('bearer');
      window.location.reload();
    }
  }

  getTodayDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  }

  ngOnDestroy() {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    this.taskWebSocketService.close();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  closeFilters() {
    this.showFilters = false;
  }

  sortTasks(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value;
    this.sortBy = sortBy;

    this.getAllTasks(1, this.perPage, sortBy);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }

    this.getAllTasks(this.currentPage, this.perPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }

    this.getAllTasks(this.currentPage, this.perPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getAllTasks(this.currentPage, this.perPage);
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

  toggleDropdown(taskId: number, event?: Event | null) {
    this.showFilters = false;

    if (event) {
      event.stopPropagation();
    }

    this.tasks = this.tasks.map(task =>
      task.id === taskId
        ? { ...task, showDropdown: !task.showDropdown }
        : { ...task, showDropdown: false }
    );
  }

  closeDropdown() {
    this.tasks = this.tasks.map(task => ({ ...task, showDropdown: false }));
  }

  addNewTask() {
    this.taskModal.handleToggleModal();
    this.taskModal.handleSetData('Add', undefined);
  }
  viewMoreInfo(task: Task) {
    console.log(task);
    this.toggleDropdown(task.id);
    this.taskModal.handleSetData('View', task);
    this.taskModal.handleToggleModal();
  }

  editTask(task: Task) {
    this.toggleDropdown(task.id);
    this.taskModal.handleSetData('Edit', task);
    this.taskModal.handleToggleModal();
  }

  deleteTask(taskId: number) {
    this.toggleDropdown(taskId);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        this.todoService.deleteTaskById(taskId).subscribe(
          response => {
            console.log('Task deleted:', response);
            this.getAllTasks(this.currentPage, this.perPage);
          },
          error => {
            console.error('Error deleting task:', error);
          }
        );
      }
    });
  }

  completeTask(task: Task) {
    task.completed = !task.completed;

    this.todoService.updateTask(task).subscribe(
      response => {
        console.log('Task updated:', response);
      },
      error => {
        console.error('Error updating task:', error);
        Swal.fire('Error', 'Failed to update task status', 'error');
      }
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
