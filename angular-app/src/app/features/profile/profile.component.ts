import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { ProfileService } from '../../services/profile.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { AuthService } from '../../services/auth.service';
import { postType, userType } from '../../types';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '../../utils';
import { PostComponent } from '../../components/post/post.component';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';
import { EditModalComponent } from '../../components/edit-modal/edit-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    BackButtonComponent,
    PostComponent,
    CommentModalComponent,
    EditModalComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  userId!: string;
  posts: postType[] = [];
  user!: { userId: string; username: string };
  profile!: userType;
  IsModalComment: boolean = false;
  isModalEdit: boolean = false;
  postId!: string;
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  formatDateFn(date: string | Date) {
    return formatDate(date);
  }

  fetchProfile() {
    this.profileService.getProfile(this.userId).subscribe({
      next: (data: any) => {
        this.profile = data.user;
        this.posts = data.posts;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  setIsModalCommentFn(action: boolean) {
    this.IsModalComment = action;
  }

  setIsModalEditFn(action: boolean) {
    this.isModalEdit = action;
  }

  setPostsFn(updatedPost: postType[]) {
    this.posts = updatedPost;
  }

  setPostIdFn(postId: string) {
    this.postId = postId;
  }

  onFollow(action: 'follow' | 'unfollow', userId: string) {
    this.profileService.followAction(action, userId).subscribe({
      next: (data: any) => {
        if (data === 'ok') {
          const updatedUser = this.profile;
          updatedUser.isFollowing = action === 'follow';
          updatedUser.followerCount =
            (updatedUser?.followerCount || 0) + (action === 'follow' ? 1 : -1);
          this.profile = updatedUser;
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
    this.fetchProfile();
    this.user = this.authService.getUser();
  }
}
