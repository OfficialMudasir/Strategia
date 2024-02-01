import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilesComponent } from './userProfiles.component';
import { ViewUserProfileCoursesComponent } from './view-userProfile-courses.component';
import { ViewUserProfileOnboardComponent } from './view-userProfile-onboard.component';
import { ViewUserProfileComponent } from './view-userProfile.component';
import { ViewUserProfile2Component } from './view-userProfile2.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfilesComponent,
    pathMatch: 'full',
    },
    // Full Path /main/userProfiles/3/view
    {
        path: ':profileid/view2',
        component: ViewUserProfileComponent,
        pathMatch: 'full',
    },
    {
        path: ':profileid/view',
        component: ViewUserProfile2Component,
        pathMatch: 'full',
    },
    {
        path: 'view',
        component: ViewUserProfile2Component,
        pathMatch: 'full',
    },
    {
        path: ':profileid/courses',
        component: ViewUserProfileCoursesComponent,
        pathMatch: 'full',
    },
    {
        path: 'courses',
        component: ViewUserProfileCoursesComponent,
        pathMatch: 'full',
    },
    {
        path: ':profileid/onboard',
        component: ViewUserProfileOnboardComponent,
        pathMatch: 'full',
    },
    {
        path: 'onboard',
        component: ViewUserProfileOnboardComponent,
        pathMatch: 'full',
    },
    //{ path: 'group/:groupid/board/:tasklistid', component: BoardComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
