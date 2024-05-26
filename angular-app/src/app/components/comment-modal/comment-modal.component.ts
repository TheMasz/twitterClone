import { Component, EventEmitter, Input, Output } from '@angular/core';
import { commentType, postType } from '../../types';
import { FeedService } from '../../services/feed.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css',
})
export class CommentModalComponent {
  post!: postType;
  comment: string = '';
  constructor(private feedService: FeedService) {}
  @Input() postId!: string;
  @Output() setIsModalCommentFn = new EventEmitter<boolean>();
  @Output() setCommentsFn = new EventEmitter<commentType>();

  setIsModalComment(action: boolean) {
    this.setIsModalCommentFn.emit(action);
  }

  setComments(updatedComments: commentType) {
    this.setCommentsFn.emit(updatedComments);
  }

  fetchPost() {
    this.feedService
      .getPost(`http://localhost:5000/feed/post/${this.postId}`)
      .subscribe({
        next: (data: any) => {
          this.post = data.post;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onCommentHandler(post: postType) {
    if (this.comment == '') return;
    this.feedService.commentPost(this.comment, post).subscribe({
      next: (data: any) => {
        if (this.setIsModalCommentFn.observed) this.setIsModalComment(false);
        if (this.setCommentsFn.observed) this.setComments(data.comment);
        this.comment = '';
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  onClick(event: Event) {
    event.stopPropagation();
  }

  ngOnInit() {
    this.fetchPost();
  }
}
