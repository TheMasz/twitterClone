import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean;
  private user: { userId: string; username: string };

  constructor(private apiService: ApiService) {
    this.loggedIn = !!localStorage.getItem('loggedIn');
    const userString = localStorage.getItem('user');
    this.user = userString ? JSON.parse(userString) : { userId: '', username: '' };
  }

  login(url: string, body: any) {
    return this.apiService.post(url, body, { withCredentials: true }).pipe(
      tap(() => {
        this.loggedIn = true;
        localStorage.setItem('loggedIn', 'true');
      })
    );
  }

  logout(url: string, body: any) {
    return this.apiService.post(url, body, { withCredentials: true }).pipe(
      tap(() => {
        this.loggedIn = false;
        localStorage.removeItem('loggedIn');
      })
    );
  }

  register(url: string, body: any) {
    return this.apiService.post(url, body, { withCredentials: true });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setUser(userId: string, username: string) {
    this.user = { userId, username };
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  getUser(): { userId: string; username: string } {
    return this.user;
  }
}
