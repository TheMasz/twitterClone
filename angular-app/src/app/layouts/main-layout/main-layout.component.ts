import { Component } from '@angular/core';
import { LeftSideComponent } from '../../components/left-side/left-side.component';
import { RightSideComponent } from '../../components/right-side/right-side.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [LeftSideComponent, RightSideComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
