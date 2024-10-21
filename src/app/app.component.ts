import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AuthModule } from './features/auth/auth.module';
import { ToDoModule } from './features/to-do/to-do.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ToDoModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'frontend';
}
