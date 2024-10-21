import { LoginComponent } from './features/auth/components/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { todoComponent } from './features/to-do/components/to-do/to-do.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { NonAuthGuard } from './features/auth/guards/noAuth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NonAuthGuard],
  },
  { path: 'to-do', component: todoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
