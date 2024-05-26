import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { postType } from '../types';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private apiService: ApiService) {}

  getPosts = (url: string): Observable<postType[]> => {
    return this.apiService.get(url, {
      withCredentials: true,
    });
  };

  getPost = (url: string): Observable<postType> => {
    return this.apiService.get(url, {
      withCredentials: true,
    });
  };

  addPost = (url: string, desc: string) => {
    return this.apiService.post(url, { desc }, { withCredentials: true });
  };

  likeActions = (action: 'like' | 'unlike', post: postType) => {
    return this.apiService.post(
      'http://localhost:5000/feed/post/like',
      {
        action: action,
        postId: post._id,
      },
      { withCredentials: true }
    );
  };

  saveActions = (action: 'save' | 'unsave', post: postType) => {
    return this.apiService.post(
      'http://localhost:5000/feed/post/save',
      {
        action: action,
        postId: post._id,
      },
      { withCredentials: true }
    );
  };

  deleteActions = (post: postType) => {
    return this.apiService.delete(
      `http://localhost:5000/feed/post/delete/${post._id}`,
      { withCredentials: true }
    );
  };

  commentPost = (comment: string, post: postType) => {
    return this.apiService.post(
      'http://localhost:5000/feed/post/comment',
      {
        postId: post._id,
        comment: comment,
      },
      { withCredentials: true }
    );
  };

  getTrends = () => {
    return this.apiService.get('http://localhost:5000/feed/trends', {
      withCredentials: true,
    });
  };

  getSuggestPeople = () => {
    return this.apiService.get('http://localhost:5000/feed/peoples', {
      withCredentials: true,
    });
  };

  getBookmarks = () => {
    return this.apiService.get('http://localhost:5000/feed/bookmarks', {
      withCredentials: true,
    });
  };
}
