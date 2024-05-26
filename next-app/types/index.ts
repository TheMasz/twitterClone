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
