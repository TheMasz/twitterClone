import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { FeedService } from '../../services/feed.service';
import { postType } from '../../types';
import { PostComponent } from '../../components/post/post.component';
import { AuthService } from '../../services/auth.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, PostComponent, BackButtonComponent, CommentModalComponent],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css',
})
export class BookmarkComponent {
  posts: postType[] = [];
  user!: { userId: string; username: string };
  IsModalComment: boolean = false;
  postId!: string;
  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  fetchPosts() {
    this.feedService.getBookmarks().subscribe({
      next: (data: any) => {
        console.log(data);
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
