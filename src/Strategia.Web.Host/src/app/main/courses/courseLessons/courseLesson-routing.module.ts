import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseLessonsComponent } from './courseLessons.component';

const routes: Routes = [
  {
    path: '',
    component: CourseLessonsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseLessonRoutingModule {}
