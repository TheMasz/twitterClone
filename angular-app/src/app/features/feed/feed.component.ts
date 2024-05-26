import { Component } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { postType } from '../../types';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PostComponent } from '../../components/post/post.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    PostComponent,
    CommentModalComponent,
    FormsModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {
  posts: postType[] = [];
  user!: { userId: string; username: string };
  IsModalComment: boolean = false;
  postId!: string;
  desc: string = '';

  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  fetchPosts() {
    this.feedService.getPosts('http://localhost:5000/feed/').subscribe({
      next: (data: any) => {
        this.posts = data.posts;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setIsModalCommentFn(action: boolean) {
    this.IsModalComment = action;
  }

  setPostIdFn(postId: string) {
    this.postId = postId;
  }
  
  setPostsFn(updatedPost: postType[]) {
    this.posts = updatedPost;
  }

  onPostSubmit() {
    if (!this.desc) return;
    this.feedService
      .addPost('http://localhost:5000/feed/post', this.desc)
      .subscribe({
        next: (data: any) => {
          this.posts.unshift(data.post);
          this.desc = '';
        },
      });
  }

  ngOnInit() {
    this.fetchPosts();
    this.user = this.authService.getUser();
  }
}
