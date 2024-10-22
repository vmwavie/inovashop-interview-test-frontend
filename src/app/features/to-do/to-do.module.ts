import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { TodoComponent } from './components/to-do/to-do.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TodoComponent, TaskModalComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [TodoComponent, TaskModalComponent],
})
export class ToDoModule {}
