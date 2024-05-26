import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  constructor(private authService: AuthService, private router: Router) {}

  usernameOrEmail: string = '';
  password: string = '';

  submitSignin() {
    this.authService
      .login('http://localhost:5000/auth/signin', {
        email_username: this.usernameOrEmail,
        password: this.password,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.authService.setUser(data.user.id, data.user.username);
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.log(error.message);
        },
      });
  }
}
