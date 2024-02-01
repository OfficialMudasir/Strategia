import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCourseComponent } from '../courses/view-course.component';
import { CourseLessonActivitiesComponent } from './courseLessonActivities.component';
import { ViewLessonActivityComponent } from './view-lesson-activity.component';

const routes: Routes = [
  {
    path: '',
    component: CourseLessonActivitiesComponent,
    pathMatch: 'full',
    },
    {
        path: ':courseLessonActivityId/view',
        component: ViewLessonActivityComponent,
        pathMatch: 'full',
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseLessonActivityRoutingModule {}
