import { LoginComponent } from './features/auth/components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { todoComponent } from './features/to-do/components/to-do/to-do.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'to-do', component: todoComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
