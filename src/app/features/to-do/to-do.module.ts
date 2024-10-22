import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { taskModalComponent } from './components/task-modal/task-modal.component';
import { TodoComponent } from './components/to-do/to-do.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TodoComponent, taskModalComponent],
  imports: [CommonModule, SharedModule],
  exports: [TodoComponent, taskModalComponent],
})
export class ToDoModule {}
