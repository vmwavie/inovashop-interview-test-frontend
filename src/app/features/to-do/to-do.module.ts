import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { todoComponent } from './components/to-do/to-do.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule, todoComponent],
  exports: [],
})
export class ToDoModule {}
