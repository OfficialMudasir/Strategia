import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppSessionService } from './shared/common/session/app-session.service';
import { UserProfilesServiceProxy } from './shared/service-proxies/service-proxies';

@Component({
    template: ''
})
export class DynamicRedirectComponent implements OnInit {

    userprofileId: string;

    constructor(
        private router: Router,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private appSessionService: AppSessionService
    ) { }

    ngOnInit() {
        // Check if user is logged in
        if (!this.appSessionService.user) { // Check if there is a logged-in user
            // If not logged in, redirect to /account/login
            this.router.navigate(['/account/login']);
            return; // Prevent further execution
        }

        // Existing logic for handling logged-in users
        this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
            this.userprofileId = result;
            if (!this.userprofileId || this.userprofileId === '00000000-0000-0000-0000-000000000000') {
                this.router.navigate(['/app/main/userProfiles/userProfiles/onboard']);
            } else {
                this.router.navigate(['/app/main/userProfiles/userProfiles/' + this.userprofileId + '/view']);
            }
        });
    }
}
