import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { userType } from '../../types';
import { removeHashtag } from '../../utils';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-right-side',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-side.component.html',
  styleUrl: './right-side.component.css',
})
export class RightSideComponent {
  trends!: { count: number; tag: string }[];
  peoples!: userType[];
  constructor(
    private feedService: FeedService,
    private profileService: ProfileService
  ) {}

  fetchTrends() {
    this.feedService.getTrends().subscribe({
      next: (data: any) => {
        this.trends = data.trends;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  fetchSuggestPeople() {
    this.feedService.getSuggestPeople().subscribe({
      next: (data: any) => {
        this.peoples = data.peoples;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  removeTag(tag: string) {
    return removeHashtag(tag);
  }

  onFollow(event: MouseEvent, action: 'follow' | 'unfollow', userId: string) {
    event.preventDefault();
    this.profileService.followAction(action, userId).subscribe({
      next: (data: any) => {
        if (data === 'ok') {
          const updatedPeoples = this.peoples.map((p: userType): userType => {
            if (p._id === userId) {
              return {
                ...p,
                isFollowing: action === 'follow',
              };
            }
            return p;
          });
          this.peoples = updatedPeoples;
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.fetchTrends();
    this.fetchSuggestPeople();
  }
}
