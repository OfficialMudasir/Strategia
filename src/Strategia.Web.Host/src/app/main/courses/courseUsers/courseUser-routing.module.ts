import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseUsersComponent } from './courseUsers.component';

const routes: Routes = [
  {
    path: '',
    component: CourseUsersComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseUserRoutingModule {}
