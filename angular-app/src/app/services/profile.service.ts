import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private apiService: ApiService) {}

  getProfile(userId: string) {
    return this.apiService.get(`http://localhost:5000/profile/${userId}`, {
      withCredentials: true,
    });
  }

  followAction(action: string, userId: string) {
    return this.apiService.post(
      'http://localhost:5000/profile/follow',
      {
        action,
        userId,
      },
      { withCredentials: true }
    );
  }

  updatedProfile(username: string, email: string, bio: string) {
    return this.apiService.put(
      'http://localhost:5000/profile/edit',
      {
        username,
        email,
        bio,
      },
      { withCredentials: true }
    );
  }
}
