import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordStrengthText = '';
  passwordsMatch = false;
  showPasswordMatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordChange() {
    const password = this.registerForm.get('password')?.value ?? '';
    const confirmPassword =
      this.registerForm.get('confirm_password')?.value ?? '';
    this.showPasswordMatch = confirmPassword ? true : false;

    if (!password) {
      this.passwordsMatch = false;
      this.passwordStrength = 0;
      this.passwordStrengthText = '';
      return;
    }

    this.checkPasswordStrength(password);

    this.passwordsMatch = password === confirmPassword;
  }

  checkPasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    if (password.match(/[$@#&!]+/)) strength += 25;

    this.passwordStrength = Math.min(100, strength);

    if (this.passwordStrength < 33) {
      this.passwordStrengthText = 'Weak';
    } else if (this.passwordStrength < 66) {
      this.passwordStrengthText = 'Medium';
    } else {
      this.passwordStrengthText = 'Strong';
    }
  }

  onSubmit() {
    if (this.registerForm.valid && this.passwordsMatch) {
      this.authService.register(this.registerForm.value).subscribe(
        data => {
          console.log('User registered successfully:', data);
          this.router.navigate(['/to-do']);
        },
        error => {
          console.log('Error registering user:', error);

          if (error.error.message === 'email_in_use') {
            Swal.fire('Error', 'Email already exists.', 'error');
            return;
          }

          if (
            error.error.msg ===
            '"password" length must be at least 8 characters long'
          ) {
            Swal.fire('Error', 'Password is too short.', 'error');
            return;
          }

          Swal.fire(
            'Error',
            'Internal error occurred, please try again in few moments.',
            'error'
          );

          return;
        }
      );
    }
  }
}
