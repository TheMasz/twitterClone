import { Routes } from '@angular/router';
import { FeedComponent } from './features/feed/feed.component';
import { SigninComponent } from './features/signin/signin.component';
import { SignupComponent } from './features/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { PostDetailsComponent } from './features/post-details/post-details.component';
import { ProfileComponent } from './features/profile/profile.component';
import { TagComponent } from './features/tag/tag.component';
import { BookmarkComponent } from './features/bookmark/bookmark.component';

export const routes: Routes = [
  {
    path: '',
    component: FeedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'post/:id',
    component: PostDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tag/:tag',
    component: TagComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bookmarks',
    component: BookmarkComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
];
