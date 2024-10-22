import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { Task } from '../../models/task.models';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToDoService } from '../../services/to-do.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.sass'],
})
export class TaskModalComponent implements OnChanges, OnInit, OnInit {
  @Input() isOpened = false;
  @Input() target: 'Add' | 'Edit' | 'View' = 'View';
  @Input() userId: number | null = null;
  @Input() task?: Task;

  @Output() toggleModal = new EventEmitter<void>();
  @Output() submitTask = new EventEmitter<Task>();

  taskForm: FormGroup;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private todoService: ToDoService,
    private formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      this.userId = userStr ? JSON.parse(userStr).id : null;
    }
  }

  ngOnChanges() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
      });
    } else {
      this.taskForm.reset();
    }
  }

  handleSetData(
    target: 'Edit' | 'View' | 'Add',
    data: Task | undefined = undefined
  ) {
    this.task = undefined;
    this.target = 'View';

    this.task = data;

    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
      });
    } else {
      this.taskForm.reset();
    }

    this.target = target;
  }

  handleToggleModal() {
    this.isOpened = !this.isOpened;
    if (!this.isOpened) {
      this.task = undefined;
      this.target = 'View';
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      if (this.target === 'Add') {
        this.todoService
          .createTask(formData.title, formData.description)
          .subscribe(
            response => {
              console.log('Task created:', response);
              Swal.fire('Success', 'Task created successfully!', 'success');
            },
            error => {
              console.error('Error creating task:', error);
              Swal.fire('Error', 'Error creating task!', 'error');
            }
          );
      } else if (this.target === 'Edit' && this.task) {
        this.task.title = formData.title;
        this.task.description = formData.description;

        this.todoService.updateTask(this.task).subscribe(
          response => {
            console.log('Task updated:', response);
            Swal.fire('Success', 'Task updated successfully!', 'success');
          },
          error => {
            console.error('Error updating task:', error);
            Swal.fire('Error', 'Error updating task!', 'error');
          }
        );
      }

      this.taskForm.reset();
      this.handleToggleModal();
    }
  }
}
