import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfilesServiceProxy, UserProfileDto, EmploymentHistory, GetUserProfileForEditOutput } from '@shared/service-proxies/service-proxies';
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
import { DialogService } from '../../../shared/helpers/dialog-service';

@Component({
    templateUrl: './create-or-edit-userProfile-employment.component.html',
    selector: 'create-or-edit-userProfile-employment',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateOrEditUserProfileEmployment extends AppComponentBase {


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    //@Output() onSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    selectedItemChanged = false;

    /*    userProfile: CreateOrEditUserProfileDto = new CreateOrEditUserProfileDto();*/

    userName = '';
    edit = true;

    uploadedFiles: any[] = [];

    position: any;
    years: number[] = [];

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _dateTimeService: DateTimeService,
        private dialogService: DialogService
    ) {
        super(injector);
    }

    userprofile: GetUserProfileForEditOutput;
    index: number;
    show(u: GetUserProfileForEditOutput, p: any): void {

        this.index = u.userProfile.parsedResume.employmentHistory.positions.indexOf(p);
        this.userprofile = u; 
    }

    save(): void {
        this.saving = true;
        this.close();
    }

    /* Set the width of the side navigation to 0 */
    public close = (): boolean => {
        if (this.selectedItemChanged === true) {
            if (this.dialogService.confirm(this.l('UnsavedChanges'))) {
                this.selectedItemChanged = false;
                this.modalSave.emit(this.position);
                document.getElementById("createOrEditUserProfileEmploymentContent").style.width = "0em";
                return true;
            }
            else {
                return false;
            }
        }
        else {
            document.getElementById("createOrEditUserProfileEmploymentContent").style.width = "0em";
            return true;
        }
    }
    selecteditemChanged = true
    ngOnInit(): void {
        const currentYear = new Date().getFullYear();
        for (let year = 1940; year <= currentYear; year++) {
            this.years.push(year);
        }
    }

    public onStartYearChange(newYear: number): void {
        // Handle the start year change here
        // You might need to create a new date object and assign it to position.startDate
        this.userprofile.userProfile.parsedResume.employmentHistory.positions[this.index].startDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));

    }

    public onEndYearChange(newYear: number): void {
        // Handle the end year change here
        // You might need to create a new date object and assign it to position.endDate
        this.userprofile.userProfile.parsedResume.employmentHistory.positions[this.index].endDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));
    }
}
