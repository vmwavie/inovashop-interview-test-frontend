import { NgModule } from '@angular/core';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DateFormatPipe, ClickOutsideDirective],
  imports: [CommonModule],
  exports: [DateFormatPipe, ClickOutsideDirective],
})
export class SharedModule {}
