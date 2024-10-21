import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Task } from '../../models/task.models';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.sass'],
})
export class taskModalComponent implements OnInit {
  isOpened = false;
  isEdit = false;
  task: Task | undefined;
  target: 'Edit' | 'View' | 'Add' = 'View';
  private userId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      this.userId = userStr ? JSON.parse(userStr).id : null;
    }
  }

  handleSetData(
    target: 'Edit' | 'View' | 'Add',
    data: Task | undefined = undefined
  ) {
    this.task = data;
    this.target = target;

    console.log(this.userId);
  }

  handleToggleModal() {
    console.log('Toggle modal');
    this.isOpened = !this.isOpened;
  }
}
