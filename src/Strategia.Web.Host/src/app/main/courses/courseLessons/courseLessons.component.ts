import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseLessonsServiceProxy, CourseLessonDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCourseLessonModalComponent } from './create-or-edit-courseLesson-modal.component';

import { ViewCourseLessonModalComponent } from './view-courseLesson-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './courseLessons.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class CourseLessonsComponent extends AppComponentBase {
  @ViewChild('createOrEditCourseLessonModal', { static: true })
  createOrEditCourseLessonModal: CreateOrEditCourseLessonModalComponent;
  @ViewChild('viewCourseLessonModal', { static: true }) viewCourseLessonModal: ViewCourseLessonModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  advancedFiltersAreShown = false;
  filterText = '';
  nameFilter = '';
  descriptionFilter = '';
  courseDisplayPropertyFilter = '';

  constructor(
    injector: Injector,
    private _courseLessonsServiceProxy: CourseLessonsServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  getCourseLessons(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._courseLessonsServiceProxy
      .getAll(
        this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.courseDisplayPropertyFilter,
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getMaxResultCount(this.paginator, event)
      )
        .subscribe((result) => {
            debugger;
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  reloadPage(): void {
    this.paginator.changePage(this.paginator.getPage());
  }

  createCourseLesson(): void {
    this.createOrEditCourseLessonModal.show();
  }

  deleteCourseLesson(courseLesson: CourseLessonDto): void {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._courseLessonsServiceProxy.delete(courseLesson.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  exportToExcel(): void {
    this._courseLessonsServiceProxy
      .getCourseLessonsToExcel(
        this.filterText,
        this.nameFilter,
        this.descriptionFilter,
        this.courseDisplayPropertyFilter
      )
      .subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
      });
  }

  resetFilters(): void {
    this.filterText = '';
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.courseDisplayPropertyFilter = '';

    this.getCourseLessons();
  }
}
