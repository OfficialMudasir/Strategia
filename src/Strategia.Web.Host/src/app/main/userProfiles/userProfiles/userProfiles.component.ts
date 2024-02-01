import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfilesServiceProxy, UserProfileDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditUserProfileModalComponent } from './create-or-edit-userProfile-modal.component';

import { ViewUserProfileModalComponent } from './view-userProfile-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './userProfiles.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()],
})
export class UserProfilesComponent extends AppComponentBase {
  @ViewChild('createOrEditUserProfileModal', { static: true })
  createOrEditUserProfileModal: CreateOrEditUserProfileModalComponent;
  @ViewChild('viewUserProfileModal', { static: true }) viewUserProfileModal: ViewUserProfileModalComponent;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  advancedFiltersAreShown = false;
  filterText = '';
  profileNameFilter = '';
  profileDescriptionFilter = '';
  parsedResumeFilter = '';
  archiveFilter = -1;
  activeFilter = -1;
  userNameFilter = '';

  constructor(
    injector: Injector,
    private _userProfilesServiceProxy: UserProfilesServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  getUserProfiles(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
        return;
      }
    }

    this.primengTableHelper.showLoadingIndicator();

    this._userProfilesServiceProxy
      .getAll(
        this.filterText,
        this.profileNameFilter,
        this.profileDescriptionFilter,
        this.parsedResumeFilter,
        this.archiveFilter,
        this.activeFilter,
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

  createUserProfile(): void {
    this.createOrEditUserProfileModal.show();
  }

  deleteUserProfile(userProfile: UserProfileDto): void {
    this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
      if (isConfirmed) {
        this._userProfilesServiceProxy.delete(userProfile.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  exportToExcel(): void {
    this._userProfilesServiceProxy
      .getUserProfilesToExcel(
        this.filterText,
        this.profileNameFilter,
        this.profileDescriptionFilter,
        this.parsedResumeFilter,
        this.archiveFilter,
        this.activeFilter,
        this.userNameFilter
      )
      .subscribe((result) => {
        this._fileDownloadService.downloadTempFile(result);
      });
  }

  resetFilters(): void {
    this.filterText = '';
    this.profileNameFilter = '';
    this.profileDescriptionFilter = '';
    this.parsedResumeFilter = '';
    this.archiveFilter = -1;
    this.activeFilter = -1;
    this.userNameFilter = '';

    this.getUserProfiles();
  }
}
