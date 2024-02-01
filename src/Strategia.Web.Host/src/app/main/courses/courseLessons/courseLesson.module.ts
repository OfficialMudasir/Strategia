import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { CourseLessonRoutingModule } from './courseLesson-routing.module';
import { CourseLessonsComponent } from './courseLessons.component';
import { CreateOrEditCourseLessonModalComponent } from './create-or-edit-courseLesson-modal.component';
import { ViewCourseLessonModalComponent } from './view-courseLesson-modal.component';
import { CourseLessonCourseLookupTableModalComponent } from './courseLesson-course-lookup-table-modal.component';

@NgModule({
  declarations: [
    CourseLessonsComponent,
    CreateOrEditCourseLessonModalComponent,
    ViewCourseLessonModalComponent,

    CourseLessonCourseLookupTableModalComponent,
  ],
  imports: [AppSharedModule, CourseLessonRoutingModule, AdminSharedModule],
})
export class CourseLessonModule {}
