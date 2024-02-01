import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { UserProfileRoutingModule } from './userProfile-routing.module';
import { UserProfilesComponent } from './userProfiles.component';
import { CreateOrEditUserProfileModalComponent } from './create-or-edit-userProfile-modal.component';
import { ViewUserProfileModalComponent } from './view-userProfile-modal.component';
import { UserProfileUserLookupTableModalComponent } from './userProfile-user-lookup-table-modal.component';
import { ViewUserProfileComponent } from './view-userProfile.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { CreateOrEditUserProfileEducationComponent } from './create-or-edit-userProfile-education.component';
import { CreateOrEditUserProfileEmployment } from './create-or-edit-userProfile-employment.component';
import { ViewUserProfileWizardComponent } from './view-userProfile-wizard.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViewUserProfile2Component } from './view-userProfile2.component';
import { ChangeProfilePictureModule } from '../../../shared/layout/profile/change-profile-picture.module';
import { AppFilesComponent } from '../../appFiles/appFiles.component';
import { FilesServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ViewUserProfileOnboardComponent } from './view-userProfile-onboard.component';
import { ViewUserProfileCoursesComponent } from './view-userProfile-courses.component';
import { CourseModule } from '../../courses/courses/course.module';
import { CourseLessonActivityModule } from '../../courses/courseLessonActivities/courseLessonActivity.module';
import { ViewUserProfileMyCoursesComponent } from './view-userProfile-myCourses.component';
/*//import {ProgressBarModule} from "angular-progress-bar"*/


@NgModule({
  declarations: [
        UserProfilesComponent,
        CreateOrEditUserProfileEducationComponent,
        ViewUserProfileWizardComponent,
        CreateOrEditUserProfileEmployment,
        CreateOrEditUserProfileModalComponent,
        ViewUserProfileModalComponent,
        ViewUserProfileComponent,
        ViewUserProfile2Component,
        ViewUserProfileCoursesComponent,
        ViewUserProfileMyCoursesComponent,
        ViewUserProfileOnboardComponent,
        UserProfileUserLookupTableModalComponent,
        AppFilesComponent
    ],
    providers: [FilesServiceProxy],
    imports: [AppSharedModule,
        UserProfileRoutingModule,
        AdminSharedModule,
        MultiSelectModule,
        ListboxModule,
        TextMaskModule,
        ChangeProfilePictureModule,
        CourseModule,
        CourseLessonActivityModule,
        AccordionModule.forRoot(),
        //ProgressBarModule
    ],
})
export class UserProfileModule {}
