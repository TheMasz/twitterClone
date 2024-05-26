import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { FeedService } from '../../services/feed.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { postType } from '../../types';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';
import { PostComponent } from '../../components/post/post.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    BackButtonComponent,
    CommentModalComponent,
    PostComponent,
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
})
export class TagComponent {
  posts: postType[] = [];
  user!: { userId: string; username: string };
  IsModalComment: boolean = false;
  postId!: string;

  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  fetchPosts() {
    this.feedService.getPosts('http://localhost:5000/feed/').subscribe({
      next: (data: any) => {
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

  setPostsFn(updatedPost: postType[]) {
    this.posts = updatedPost;
  }

  setPostIdFn(postId: string) {
    this.postId = postId;
  }

  ngOnInit() {
    this.fetchPosts();
    this.user = this.authService.getUser();
  }
}
