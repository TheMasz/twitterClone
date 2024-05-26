import { Component, EventEmitter, Input, Output } from '@angular/core';
import { postType } from '../../types';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../services/feed.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  constructor(private feedService: FeedService, private router: Router) {}
  @Input() post!: postType;
  @Input() posts!: postType[];
  @Input() user!: { userId: string; username: string };
  @Output() setIsModalCommentFn = new EventEmitter<boolean>();
  @Output() setPostIdFn = new EventEmitter<string>();
  @Output() setPostsFn = new EventEmitter<postType[]>();
  @Output() setPostFn = new EventEmitter<postType>();

  setIsModalComment(action: boolean) {
    this.setIsModalCommentFn.emit(action);
  }

  setPosts(updatedPosts: postType[]) {
    this.setPostsFn.emit(updatedPosts);
  }

  setPost(updatedPost: postType) {
    this.setPostFn.emit(updatedPost);
  }

  setPostId(postId: string) {
    this.setPostIdFn.emit(postId);
  }

  likeHandler(action: 'like' | 'unlike', post: postType) {
    this.feedService.likeActions(action, post).subscribe({
      next: (data: any) => {
        if (data == 'ok') {
          if (this.setPostsFn.observed) {
            const updatedPosts = this.posts.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  likedByCurrentUser: action === 'like',
                  likesCount:
                    (p.likesCount || 0) + (action === 'like' ? 1 : -1),
                };
              }
              return p;
            });
            this.setPosts(updatedPosts);
          }
          if (this.setPostFn.observed) {
            const updatedPost = this.post;
            updatedPost.likedByCurrentUser = action === 'like';
            updatedPost.likesCount =
              (post.likesCount || 0) + (action === 'like' ? 1 : -1);
            this.setPost(updatedPost);
          }
        }
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  saveHandler(action: 'save' | 'unsave', post: postType) {
    this.feedService.saveActions(action, post).subscribe({
      next: (data: any) => {
        if (data == 'ok') {
          if (this.setPostsFn.observed) {
            const updatedPosts = this.posts.map((p) => {
              if (p._id === post._id) {
                return {
                  ...p,
                  savedByCurrentUser: action === 'save',
                };
              }
              return p;
            });
            this.setPosts(updatedPosts);
          }
          if (this.setPostFn.observed) {
            const updatedPost = this.post;
            updatedPost.savedByCurrentUser = action === 'save';
            this.setPost(updatedPost);
          }
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  deleteHandler(event: MouseEvent, post: postType) {
    event.preventDefault();
    const cf = confirm('you want to delete this post?');
    if (cf)
      this.feedService.deleteActions(post).subscribe({
        next: (data: any) => {
          if (data == 'Post removed') {
            if (this.setPostsFn.observed) {
              const updatedPosts = this.posts.filter((p) => p._id != post._id);
              this.setPosts(updatedPosts);
            }
            this.router.navigate(['/']);
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
    return;
  }
}
