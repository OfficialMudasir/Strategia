import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { CourseRoutingModule } from './course-routing.module';
import { CoursesComponent } from './courses.component';
import { CreateOrEditCourseModalComponent } from './create-or-edit-course-modal.component';
import { ViewCourseModalComponent } from './view-course-modal.component';
import { CourseUserLookupTableModalComponent } from './course-user-lookup-table-modal.component';
import { ViewCourseComponent } from './view-course.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ChangeProfilePictureModule } from '../../../shared/layout/profile/change-profile-picture.module';

@NgModule({
  declarations: [
    CoursesComponent,
    CreateOrEditCourseModalComponent,
    ViewCourseModalComponent,
    ViewCourseComponent,
        CourseUserLookupTableModalComponent,

  ],
    imports: [AppSharedModule, CKEditorModule, CourseRoutingModule, AdminSharedModule, ChangeProfilePictureModule,  AccordionModule.forRoot(),],
    exports: [CoursesComponent, CreateOrEditCourseModalComponent, CKEditorModule, ViewCourseModalComponent, CourseUserLookupTableModalComponent, ViewCourseComponent],
})
export class CourseModule {}
