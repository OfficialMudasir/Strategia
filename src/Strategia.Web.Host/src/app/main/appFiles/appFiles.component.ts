import { AppConsts } from '@shared/AppConsts';
import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfilesServiceProxy, UserProfileDto, FilesServiceProxy, CloudFileType, PagedResultDtoOfCloudFileDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
 
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  templateUrl: './appFiles.component.html',
  encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
  selector: 'app-files'
})
export class AppFilesComponent extends AppComponentBase implements OnInit {

    @Input() fileId: string;

    userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");
 
  constructor(
    injector: Injector,
      private _fileServiceProxy: FilesServiceProxy,
    private _notifyService: NotifyService,
    private _tokenAuth: TokenAuthServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _fileDownloadService: FileDownloadService,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

    ngOnInit() {
        this.loadCloudFiles();
        this.registerToEvents(); 
    }

    registerToEvents() {
        this.subscribeToEvent('app.cloudFileUploaded', () => {
            debugger;
            this.loadCloudFiles();
        });
    }

    cloudFiles: PagedResultDtoOfCloudFileDto;
    loadCloudFiles(userProfileId?: string): void {

        const cloudFileType = CloudFileType.UserProfile; // Replace with actual CloudFileType
        const path = `userprofiles/${this.userProfileId}/certificates/${this.fileId}`; // Replace with actual path

        this._fileServiceProxy.getCloudFiles(this.fileId, cloudFileType, path)
            .subscribe(result => {
                this.cloudFiles = result;
               
            },
            error => console.error('There was an error loading the cloud files', error));
    }

    getLastSegment(path: string): string {
        const decodedPath = decodeURIComponent(path);
        return decodedPath.substring(decodedPath.lastIndexOf('/') + 1);
    }

    downloadCloudFile(filename?: string): void {
        // _fileDownloadService.
        debugger;
        var filepath = `userprofiles/${this.userProfileId}/certificates/${this.fileId}/${filename}`;

        this._fileServiceProxy.downloadCloudFile(filename)
            .subscribe(result => {
                this._fileDownloadService.downloadTempFile(result);
            },
            error => console.error('There was an error loading the cloud files', error));
    }

}
