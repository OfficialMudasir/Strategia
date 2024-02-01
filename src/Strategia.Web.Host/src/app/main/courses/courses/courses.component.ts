import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesServiceProxy, CourseDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCourseModalComponent } from './create-or-edit-course-modal.component';

import { ViewCourseModalComponent } from './view-course-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './courses.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class CoursesComponent extends AppComponentBase {
  @ViewChild('createOrEditCourseModal', { static: true }) createOrEditCourseModal: CreateOrEditCourseModalComponent;
  @ViewChild('viewCourseModal', { static: true }) viewCourseModal: ViewCourseModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  advancedFiltersAreShown = false;
  filterText = '';
  nameFilter = '';
  descriptionFilter = '';
  userNameFilter = '';

  constructor(
    injector: Injector,
    private _coursesServiceProxy: CoursesServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  getCourses(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._coursesServiceProxy
      .getAll(
        this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.userNameFilter,
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getMaxResultCount(this.paginator, event)
      )
      .subscribe((result) => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createCourse(): void {
    this.createOrEditCourseModal.show();
  }

  deleteCourse(course: CourseDto): void {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._coursesServiceProxy.delete(course.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  exportToExcel(): void {
    this._coursesServiceProxy
      .getCoursesToExcel(this.filterText, this.nameFilter, this.descriptionFilter, this.userNameFilter)
      .subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
      });
  }

  resetFilters(): void {
    this.filterText = '';
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.userNameFilter = '';

    this.getCourses();
  }
}
