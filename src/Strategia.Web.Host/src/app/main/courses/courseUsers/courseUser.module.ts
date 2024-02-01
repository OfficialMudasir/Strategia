import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { CourseUserRoutingModule } from './courseUser-routing.module';
import { CourseUsersComponent } from './courseUsers.component';
import { CreateOrEditCourseUserModalComponent } from './create-or-edit-courseUser-modal.component';
import { ViewCourseUserModalComponent } from './view-courseUser-modal.component';
import { CourseUserCourseLookupTableModalComponent } from './courseUser-course-lookup-table-modal.component';
import { CourseUserCourseLessonLookupTableModalComponent } from './courseUser-courseLesson-lookup-table-modal.component';
import { CourseUserCourseLessonActivityLookupTableModalComponent } from './courseUser-courseLessonActivity-lookup-table-modal.component';

@NgModule({
  declarations: [
    CourseUsersComponent,
    CreateOrEditCourseUserModalComponent,
    ViewCourseUserModalComponent,

    CourseUserCourseLookupTableModalComponent,
    CourseUserCourseLessonLookupTableModalComponent,
    CourseUserCourseLessonActivityLookupTableModalComponent,
  ],
  imports: [AppSharedModule, CourseUserRoutingModule, AdminSharedModule],
})
export class CourseUserModule {}
