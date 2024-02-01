import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { CourseLessonActivityRoutingModule } from './courseLessonActivity-routing.module';
import { CourseLessonActivitiesComponent } from './courseLessonActivities.component';
import { CreateOrEditCourseLessonActivityModalComponent } from './create-or-edit-courseLessonActivity-modal.component';
import { ViewCourseLessonActivityModalComponent } from './view-courseLessonActivity-modal.component';
import { CourseLessonActivityCourseLessonLookupTableModalComponent } from './courseLessonActivity-courseLesson-lookup-table-modal.component';
import { ViewLessonActivityComponent } from './view-lesson-activity.component';

@NgModule({
  declarations: [
    CourseLessonActivitiesComponent,
    CreateOrEditCourseLessonActivityModalComponent,
        ViewCourseLessonActivityModalComponent,
        ViewLessonActivityComponent,
    CourseLessonActivityCourseLessonLookupTableModalComponent,
  ],
    imports: [AppSharedModule, CourseLessonActivityRoutingModule, AdminSharedModule],
    exports: [CourseLessonActivitiesComponent, ViewLessonActivityComponent]
})
export class CourseLessonActivityModule {}
