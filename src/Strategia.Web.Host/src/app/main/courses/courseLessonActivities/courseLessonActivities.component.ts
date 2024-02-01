import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ActivityType,
  CourseLessonActivitiesServiceProxy,
  CourseLessonActivityDto,
 
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCourseLessonActivityModalComponent } from './create-or-edit-courseLessonActivity-modal.component';

import { ViewCourseLessonActivityModalComponent } from './view-courseLessonActivity-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './courseLessonActivities.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class CourseLessonActivitiesComponent extends AppComponentBase {
  @ViewChild('createOrEditCourseLessonActivityModal', { static: true })
  createOrEditCourseLessonActivityModal: CreateOrEditCourseLessonActivityModalComponent;
  @ViewChild('viewCourseLessonActivityModal', { static: true })
  viewCourseLessonActivityModal: ViewCourseLessonActivityModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  advancedFiltersAreShown = false;
  filterText = '';
  nameFilter = '';
  descriptionFilter = '';
  activityTypeFilter = -1;
  courseLessonDisplayPropertyFilter = '';

  activityTypes = ActivityType;

  constructor(
    injector: Injector,
    private _courseLessonActivitiesServiceProxy: CourseLessonActivitiesServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  getCourseLessonActivities(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._courseLessonActivitiesServiceProxy
      .getAll(
        this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.activityTypeFilter,
        this.courseLessonDisplayPropertyFilter,
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

  createCourseLessonActivity(): void {
    this.createOrEditCourseLessonActivityModal.show();
  }

  deleteCourseLessonActivity(courseLessonActivity: CourseLessonActivityDto): void {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._courseLessonActivitiesServiceProxy.delete(courseLessonActivity.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  exportToExcel(): void {
    this._courseLessonActivitiesServiceProxy
      .getCourseLessonActivitiesToExcel(
        this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.activityTypeFilter,
        this.courseLessonDisplayPropertyFilter
      )
      .subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
      });
  }

  resetFilters(): void {
    this.filterText = '';
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.activityTypeFilter = -1;
    this.courseLessonDisplayPropertyFilter = '';

    this.getCourseLessonActivities();
  }
}
