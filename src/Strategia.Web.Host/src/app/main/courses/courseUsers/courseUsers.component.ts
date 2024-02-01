import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseUsersServiceProxy, CourseUserDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCourseUserModalComponent } from './create-or-edit-courseUser-modal.component';

import { ViewCourseUserModalComponent } from './view-courseUser-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './courseUsers.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class CourseUsersComponent extends AppComponentBase {
  @ViewChild('createOrEditCourseUserModal', { static: true })
  createOrEditCourseUserModal: CreateOrEditCourseUserModalComponent;
  @ViewChild('viewCourseUserModal', { static: true }) viewCourseUserModal: ViewCourseUserModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

    authorProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

  advancedFiltersAreShown = false;
  filterText = '';
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

  constructor(
    injector: Injector,
    private _courseUsersServiceProxy: CourseUsersServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
      private _dateTimeService: DateTimeService,
      private _profileServiceProxy: ProfileServiceProxy
  ) {
    super(injector);
  }

  getCourseUsers(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._courseUsersServiceProxy
      .getAll(
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
        '',
        this.userProfileProfileNameFilter,
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

  createCourseUser(): void {
    this.createOrEditCourseUserModal.show();
  }

    getProfilePictureByUserName(name): void {
        this._profileServiceProxy.getProfilePictureByUserName(name).subscribe((result) => {
            if (result && result.profilePicture) {
                this.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

  deleteCourseUser(courseUser: CourseUserDto): void {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._courseUsersServiceProxy.delete(courseUser.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  exportToExcel(): void {
    this._courseUsersServiceProxy
      .getCourseUsersToExcel(
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
        this.userProfileProfileNameFilter
      )
      .subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
      });
  }

  resetFilters(): void {
    this.filterText = '';
    this.maxCourseTotalFilter = this.maxCourseTotalFilterEmpty;
    this.minCourseTotalFilter = this.maxCourseTotalFilterEmpty;
    this.maxCourseCompletedTotalFilter = this.maxCourseCompletedTotalFilterEmpty;
    this.minCourseCompletedTotalFilter = this.maxCourseCompletedTotalFilterEmpty;
    this.maxCourseLessonTotalFilter = this.maxCourseLessonTotalFilterEmpty;
    this.minCourseLessonTotalFilter = this.maxCourseLessonTotalFilterEmpty;
    this.maxCourseLessonCompletedTotalFilter = this.maxCourseLessonCompletedTotalFilterEmpty;
    this.minCourseLessonCompletedTotalFilter = this.maxCourseLessonCompletedTotalFilterEmpty;
    this.maxCourseLessonActivityTotalFilter = this.maxCourseLessonActivityTotalFilterEmpty;
    this.minCourseLessonActivityTotalFilter = this.maxCourseLessonActivityTotalFilterEmpty;
    this.maxCourseLessonActivityCompletedTotalFilter = this.maxCourseLessonActivityCompletedTotalFilterEmpty;
    this.minCourseLessonActivityCompletedTotalFilter = this.maxCourseLessonActivityCompletedTotalFilterEmpty;
    this.courseNameFilter = '';
    this.courseLessonNameFilter = '';
    this.courseLessonActivityNameFilter = '';
    this.userProfileProfileNameFilter = '';

    this.getCourseUsers();
  }
}
