import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { CoursesServiceProxy, GetCourseForViewDto, PagedResultDtoOfGetCourseForViewDto, TenantDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
    selector: 'app-widget-widget-course-report',
    templateUrl: './widget-course-report.component.html',
    styleUrls: ['./widget-course-report.component.css'],
})
export class WidgetCourseReportComponent extends WidgetComponentBaseComponent implements OnInit {

    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    userNameFilter = '';

    courses: GetCourseForViewDto[];

    constructor(injector: Injector,
        private _tenantdashboardService: TenantDashboardServiceProxy,
        private _coursesServiceProxy: CoursesServiceProxy) {
        super(injector);
 
    }

    ngOnInit() {
        this.getCourses();
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
}
