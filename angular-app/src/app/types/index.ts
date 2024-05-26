import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export type postType = {
  _id: string;
  desc: string;
  imagePath: string;
  tags: string[];
  userId: string;
  username?: string;
  likedByCurrentUser?: boolean;
  likesCount?: number | undefined;
  savedByCurrentUser?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type commentType = {
  _id: string;
  comment: string;
  userId: string;
  postId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type userType = {
  _id: string;
  email: string;
  username: string;
  bio?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  followingCount?: number;
  followerCount?: number;
  isFollowing?: boolean;
};

export interface PaginatingParams {
  [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
  page: number;
  perPage: number;
}
