import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { taskModalComponent } from './components/task-modal/task-modal.component';
import { TodoComponent } from './components/to-do/to-do.component';

@NgModule({
  declarations: [TodoComponent, taskModalComponent],
  imports: [CommonModule],
  exports: [TodoComponent, taskModalComponent],
})
export class ToDoModule {}
