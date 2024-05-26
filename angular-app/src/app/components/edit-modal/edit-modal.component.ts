import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent {
  username: string = '';
  email: string = '';
  bio: string = '';
  constructor(private profileService: ProfileService) {}
  @Output() setIsModalEditFn = new EventEmitter<boolean>();
  @Input() userId!: string;

  setIsModalEdit(action: boolean) {
    this.setIsModalEditFn.emit(action);
  }

  onClick(event: Event) {
    event.stopPropagation();
  }

  onSubmitEdit() {
    this.profileService
      .updatedProfile(this.username, this.email, this.bio)
      .subscribe({
        next: (data: any) => {
          if (data.success) {
            location.reload();
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  fetchProfile() {
    this.profileService.getProfile(this.userId).subscribe({
      next: (data: any) => {
        this.username = data.user.username;
        this.email = data.user.email;
        this.bio = data.user.bio;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.fetchProfile();
  }
}
