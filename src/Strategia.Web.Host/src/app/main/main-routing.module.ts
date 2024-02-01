import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    
                    {
                        path: 'courses/courseUsers',
                        loadChildren: () => import('./courses/courseUsers/courseUser.module').then(m => m.CourseUserModule),
                        data: { permission: 'Pages.CourseUsers' }
                    },
                
                    
                    {
                        path: 'courses/courseLessonActivities',
                        loadChildren: () => import('./courses/courseLessonActivities/courseLessonActivity.module').then(m => m.CourseLessonActivityModule),
                        data: { permission: 'Pages.CourseLessonActivities' }
                    },
                
                    
                    {
                        path: 'courses/courseLessons',
                        loadChildren: () => import('./courses/courseLessons/courseLesson.module').then(m => m.CourseLessonModule),
                        data: { permission: 'Pages.CourseLessons' }
                    },
                
                    
                    {
                        path: 'courses/courses',
                        loadChildren: () => import('./courses/courses/course.module').then(m => m.CourseModule),
                        data: { permission: 'Pages.Courses' }
                    },
                
                    
                    {
                        path: 'userProfiles/userProfiles',
                        loadChildren: () => import('./userProfiles/userProfiles/userProfile.module').then(m => m.UserProfileModule),
                        data: { permission: 'Pages.UserProfiles' }
                    },
                
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
                        data: { permission: 'Pages.Tenant.Dashboard' },
                    },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' },
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MainRoutingModule {}
