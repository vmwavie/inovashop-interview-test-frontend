import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.router.navigate(['/to-do']);
        },
        error => {
          console.error('Login failed', error.error);
          if (
            error.error.message &&
            error.error.message === 'field_does_not_match'
          ) {
            console.error('Error message:', error.error.message);
            Swal.fire('Error', 'Email or password is incorrect.', 'error');
            return;
          }

          switch (error.error.msg) {
            case '"email" must be a valid email':
              Swal.fire('Error', 'Email dont exists or is invalid.', 'error');
              break;
            case '"password" length must be at least 8 characters long':
              Swal.fire('Error', 'Password is incorrect', 'error');
              break;
            case 'user_unauthorized_access':
              Swal.fire('Error', 'Email or password is incorrect.', 'error');
              break;
            default:
              Swal.fire(
                'Error',
                'Internal error occurred, please try again in few moments.',
                'error'
              );
          }
        }
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
