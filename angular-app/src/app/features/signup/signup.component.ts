import { Component } from '@angular/core';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private authService: AuthService) {}

  email: string = '';
  password: string = '';
  cf_password: string = '';

  submitSignup() {
    this.authService
      .register('http://localhost:5000/auth/signup', {
        email: this.email,
        password: this.password,
        cf_password: this.cf_password,
      })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error.message);
        },
      });
  }
}
