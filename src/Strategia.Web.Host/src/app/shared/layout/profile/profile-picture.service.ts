import { Injectable, EventEmitter  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  saveProfilePicture: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }
  notifySaveProfilePicture(): void {
    this.saveProfilePicture.emit();
  }
  
// **************** Profile Picture Upload
  private getProfilePIC = new BehaviorSubject<boolean>(false);
  getProfileData = this.getProfilePIC.asObservable();
  sendProfileData(data: boolean) {
    this.getProfilePIC.next(data);
  }

}
