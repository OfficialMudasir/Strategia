import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
 
import { ChangeProfilePictureComponent } from './change-profile-picture.component';

@NgModule({
    imports: [CommonModule, AppSharedModule],
    declarations: [ChangeProfilePictureComponent],
    exports: [ChangeProfilePictureComponent],
})
export class ChangeProfilePictureModule {}

