import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-side',
  standalone: true,
  imports: [],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.css',
})
export class LeftSideComponent {
  user!: { userId: string; username: string };
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout('http://localhost:5000/auth/logout', {});
    this.router.navigate(['/signin']);
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }
}
