import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '../../services/feed.service';
import { commentType, postType } from '../../types';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { AuthService } from '../../services/auth.service';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    PostComponent,
    CommentModalComponent,
    BackButtonComponent
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent {
  postId!: string;
  post!: postType;
  comments!: commentType[];
  isModalComment: boolean = false;
  user!: { userId: string; username: string };
  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  fetchPost() {
    this.feedService
      .getPost(`http://localhost:5000/feed/post/${this.postId}`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.post = data.post;
          this.comments = data.comments;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  setIsModalCommentFn(action: boolean) {
    this.isModalComment = action;
  }

  setCommentsFn(updatedComments: commentType) {
    this.comments.unshift(updatedComments);
  }

  setPostIdFn(postId: string) {
    this.postId = postId;
  }

  setPostFn(updatedPost: postType) {
    this.post = updatedPost;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });
    this.fetchPost();
    this.user = this.authService.getUser();
  }
}
