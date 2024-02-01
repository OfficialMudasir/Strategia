import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { ViewCourseComponent } from './view-course.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    pathMatch: 'full',
    },
    {
        path: ':courseId/view',
        component: ViewCourseComponent,
        pathMatch: 'full',
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
