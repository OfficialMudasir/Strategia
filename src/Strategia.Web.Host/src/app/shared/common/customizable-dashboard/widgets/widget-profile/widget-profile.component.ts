import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesServiceProxy, GetCourseForViewDto, GetUserProfileForEditOutput, PagedResultDtoOfGetCourseForViewDto, TenantDashboardServiceProxy, UserProfilesServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
    selector: 'app-widget-profile',
    templateUrl: './widget-profile.component.html',
    styleUrls: ['./widget-profile.component.css'],
})
export class WidgetProfileComponent extends WidgetComponentBaseComponent implements OnInit {

    saving = false;
    userprofile: GetUserProfileForEditOutput;
    
    constructor(injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _activatedRoute: ActivatedRoute,) {
        super(injector);
 
    }

    ngOnInit() {
        this.load();
    }

    load(userProfileId?: string): void {
        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {
            this.userprofile = result;
        });
    }

    save(): void {

        this.saving = true;

        this._userProfilesServiceProxy
            .createOrEdit(this.userprofile.userProfile)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('Saved'));
            });
    }

    createUserProfile(): void {
        // Navigate to Profile
    }

}
