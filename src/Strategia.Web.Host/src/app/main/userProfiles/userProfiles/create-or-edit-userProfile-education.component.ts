import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfilesServiceProxy, UserProfileDto, EducationDetails, GetUserProfileForEditOutput } from '@shared/service-proxies/service-proxies';
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
import { finalize, Observable } from 'rxjs';

import { DialogService } from '../../../shared/helpers/dialog-service';
import { AzureUploadService } from '../../../shared/helpers/azure-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 

@Component({
    templateUrl: './create-or-edit-userProfile-education.component.html',
    selector: 'create-or-edit-userProfile-education',
    styleUrls: ['../../str.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateOrEditUserProfileEducationComponent extends AppComponentBase {
  
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    selectedItemChanged = false;

    active = false;
    saving = false;

/*    userProfile: CreateOrEditUserProfileDto = new CreateOrEditUserProfileDto();*/

    userName = '';
    edit = true;
    Up_tabId = 1

    uploadedFiles: any[] = [];

    education: any;
    years: number[] = [];

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _dateTimeService: DateTimeService,
        private dialogService: DialogService,
        private azureUploadService: AzureUploadService,
        private http: HttpClient
    ) {
        super(injector);
    }

    ngOnInit(): void {
        const currentYear = new Date().getFullYear();
        for (let year = 1940; year <= currentYear; year++) {
            this.years.push(year);
        }
    }

    userprofile: GetUserProfileForEditOutput;
    index: number;
    show(u: GetUserProfileForEditOutput, p: any): void {
        this.index = u.userProfile.parsedResume.education.educationDetails.indexOf(p);
        this.userprofile = u;
        this.education = p;
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
                document.getElementById("createOrEditUserProfileEducationContent").style.width = "0em";
                this.modalSave.emit(this.education);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            document.getElementById("createOrEditUserProfileEducationContent").style.width = "0em";
            return true;
        }
    }

    public onStartYearChange(newYear: number): void {
        // Handle the start year change here
        // You might need to create a new date object and assign it to position.startDate
 

    }
 
    public onEndYearChange(newYear: number): void {
        // Handle the end year change here
        // You might need to create a new date object and assign it to position.endDate 
        this.userprofile.userProfile.parsedResume.education.educationDetails[this.index].endDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));
    }

    handleFileInput(event: any): Observable<any> {

        const file = event.files[0];
        if (file) {

            //// Get the SAS URL from your API
            ////this.getBlobSasUrl(file.name).subscribe(sasUrl => {

            //    // Upload the file to Azure Storage
            //    var sasUrl = `https://straesanp.blob.core.windows.net/uploads/${file.name}?sv=2020-08-04&st=2023-10-13T04%3A43%3A52Z&se=2027-12-14T04%3A43%3A00Z&sr=c&sp=racwdl&sig=iq4uXlJ2kwR4EWe%2BIekfPOvp04U5DH38MlJPrkknZmo%3D`;

            //    this.azureUploadService.uploadToAzure(sasUrl, file).subscribe(response => {
            //        console.log('File uploaded to Azure');
            //    });
            ////});

            var apiUrl = '/api/files/savefile'; // Replace with your API endpoint

 
            const formData = new FormData();
            formData.append('GroupId', 'CB5A34C7-557F-491F-9413-DD5805D6C7E7');
            formData.append('FileId', 'CB5A34C7-557F-491F-9413-DD5805D6C7E7');
            formData.append('AccessToken', '');
            formData.append('File', file);

            // Customize headers as needed (e.g., for authentication)
            const headers = new HttpHeaders();
            // headers = headers.set('Authorization', 'Bearer ' + authToken);

            // Send the POST request
            return this.http.post(apiUrl, formData, { headers });
      

        }
    }

    beforeSendHandler(event): void {
        event.xhr.abort(); // This will cancel the default upload
        this.save();
    }

    // upload completed event
    onUpload(event): void {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.save();
    }

    getBlobSasUrl(filename: string): Observable<string> {
        // Call your API to get the SAS URL for the given filename
        // This is just a placeholder. Replace with your actual API call.

        return this.http.get<string>(`/api/getSasUrl?filename=${filename}`);
    }


}
