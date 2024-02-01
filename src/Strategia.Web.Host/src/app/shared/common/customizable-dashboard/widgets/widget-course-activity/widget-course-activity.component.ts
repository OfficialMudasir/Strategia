import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { CourseInfoDto, CoursesServiceProxy, CourseUsersServiceProxy, GetCourseForViewDto, GetCourseUserForViewDto, PagedResultDtoOfGetCourseForViewDto, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
    selector: 'app-widget-widget-course-activity',
    templateUrl: './widget-course-activity.component.html',
    styleUrls: ['./widget-course-activity.component.css'],
})
export class WidgetCourseActivityComponent extends WidgetComponentBaseComponent implements OnInit {

    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    userNameFilter = '';
 
    maxCourseTotalFilter: number;
    maxCourseTotalFilterEmpty: number;
    minCourseTotalFilter: number;
    minCourseTotalFilterEmpty: number;
    maxCourseCompletedTotalFilter: number;
    maxCourseCompletedTotalFilterEmpty: number;
    minCourseCompletedTotalFilter: number;
    minCourseCompletedTotalFilterEmpty: number;
    maxCourseLessonTotalFilter: number;
    maxCourseLessonTotalFilterEmpty: number;
    minCourseLessonTotalFilter: number;
    minCourseLessonTotalFilterEmpty: number;
    maxCourseLessonCompletedTotalFilter: number;
    maxCourseLessonCompletedTotalFilterEmpty: number;
    minCourseLessonCompletedTotalFilter: number;
    minCourseLessonCompletedTotalFilterEmpty: number;
    maxCourseLessonActivityTotalFilter: number;
    maxCourseLessonActivityTotalFilterEmpty: number;
    minCourseLessonActivityTotalFilter: number;
    minCourseLessonActivityTotalFilterEmpty: number;
    maxCourseLessonActivityCompletedTotalFilter: number;
    maxCourseLessonActivityCompletedTotalFilterEmpty: number;
    minCourseLessonActivityCompletedTotalFilter: number;
    minCourseLessonActivityCompletedTotalFilterEmpty: number;
    courseNameFilter = '';
    courseLessonNameFilter = '';
    courseLessonActivityNameFilter = '';
    userProfileProfileNameFilter = '';

    courses: GetCourseForViewDto[];
    courseUsers: CourseInfoDto[];

    constructor(injector: Injector,
        private _tenantdashboardService: TenantDashboardServiceProxy,
        private _coursesServiceProxy: CoursesServiceProxy,
        private _courseUsersServiceProxy: CourseUsersServiceProxy) {
        super(injector);
 
    }

    ngOnInit() {
        this.getCourseUsers();
    }

    getCourses(event?: LazyLoadEvent) {

        //if (this.primengTableHelper.shouldResetPaging(event)) {
        //    this.paginator.changePage(0);
        //    if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        //        return;
        //    }
        //}

        //this.primengTableHelper.showLoadingIndicator();

        this._coursesServiceProxy
            .getAll(
                this.filterText,
                this.nameFilter,
                this.descriptionFilter,
                this.userNameFilter,
                'name asc',
                0,
                10
            )
            .subscribe((result) => {
                this.courses = result.items;
                //this.primengTableHelper.totalRecordsCount = result.totalCount;
                //this.primengTableHelper.records = result.items;
                //this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getCourseUsers(event?: LazyLoadEvent) {

        //if (this.primengTableHelper.shouldResetPaging(event)) {
        //    this.paginator.changePage(0);
        //    if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        //        return;
        //    }
        //}

        //this.primengTableHelper.showLoadingIndicator();

        this._courseUsersServiceProxy
            .getCoursesForUser(
                this.filterText,
                this.maxCourseTotalFilter == null ? this.maxCourseTotalFilterEmpty : this.maxCourseTotalFilter,
                this.minCourseTotalFilter == null ? this.minCourseTotalFilterEmpty : this.minCourseTotalFilter,
                this.maxCourseCompletedTotalFilter == null
                    ? this.maxCourseCompletedTotalFilterEmpty
                    : this.maxCourseCompletedTotalFilter,
                this.minCourseCompletedTotalFilter == null
                    ? this.minCourseCompletedTotalFilterEmpty
                    : this.minCourseCompletedTotalFilter,
                this.maxCourseLessonTotalFilter == null
                    ? this.maxCourseLessonTotalFilterEmpty
                    : this.maxCourseLessonTotalFilter,
                this.minCourseLessonTotalFilter == null
                    ? this.minCourseLessonTotalFilterEmpty
                    : this.minCourseLessonTotalFilter,
                this.maxCourseLessonCompletedTotalFilter == null
                    ? this.maxCourseLessonCompletedTotalFilterEmpty
                    : this.maxCourseLessonCompletedTotalFilter,
                this.minCourseLessonCompletedTotalFilter == null
                    ? this.minCourseLessonCompletedTotalFilterEmpty
                    : this.minCourseLessonCompletedTotalFilter,
                this.maxCourseLessonActivityTotalFilter == null
                    ? this.maxCourseLessonActivityTotalFilterEmpty
                    : this.maxCourseLessonActivityTotalFilter,
                this.minCourseLessonActivityTotalFilter == null
                    ? this.minCourseLessonActivityTotalFilterEmpty
                    : this.minCourseLessonActivityTotalFilter,
                this.maxCourseLessonActivityCompletedTotalFilter == null
                    ? this.maxCourseLessonActivityCompletedTotalFilterEmpty
                    : this.maxCourseLessonActivityCompletedTotalFilter,
                this.minCourseLessonActivityCompletedTotalFilter == null
                    ? this.minCourseLessonActivityCompletedTotalFilterEmpty
                    : this.minCourseLessonActivityCompletedTotalFilter,
                this.courseNameFilter,
                this.courseLessonNameFilter,
                this.courseLessonActivityNameFilter,
                '', //this.userProfileProfileNameFilter,
                '', 
                '',
                0,
                25
            )
            .subscribe((result) => {
                debugger;
                this.courseUsers = result.items;
                //this.primengTableHelper.totalRecordsCount = result.totalCount;
                //this.primengTableHelper.records = result.items;
                //this.primengTableHelper.hideLoadingIndicator();
            });
    }

    // Create a map to track the visibility of lessons for each course
    lessonVisibilityMap = new Map<number, boolean>();

    // Method to toggle lesson visibility
    toggleLessons(courseId: number) {
        const currentVisibility = this.lessonVisibilityMap.get(courseId);
        this.lessonVisibilityMap.set(courseId, !currentVisibility);
    }

    // Create a map to track the visibility of lessons for each course
    activityVisibilityMap = new Map<number, boolean>();

    // Method to toggle lesson visibility
    toggleActivities(Id: number) {
        debugger;
        const currentVisibility = this.activityVisibilityMap.get(Id);
        this.activityVisibilityMap.set(Id, !currentVisibility);
    }

}
