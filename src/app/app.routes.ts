import { LoginComponent } from './features/auth/components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/components/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
