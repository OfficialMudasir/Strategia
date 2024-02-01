import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyNameWithProbability, EducationDetails, EducationHistory, Employer, GetUserProfileForEditOutput, GetUserProfileForViewDto, IPosition, JobTitle, ParsedResume, Position, SovrenDate, Location as SovrenLocation, UserProfileDto, UserProfilesServiceProxy, NormalizedString, Degree, GeocodedCoordinates, SovrenPrimitiveOfInt32, ParsingNormalizedProfession, Bullet, ProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfString, ProfileServiceProxy, Certification, CreateOrEditUserProfileFileDto, CreateOrEditUserProfileDto, ContactInformation, PersonName, Telephone } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditUserProfileModalComponent } from './create-or-edit-userProfile-modal.component';
import { finalize, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateOrEditUserProfileEducationComponent } from './create-or-edit-userProfile-education.component';
import { FormControl } from '@angular/forms';

import { startWith, map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { CreateOrEditUserProfileEmployment } from './create-or-edit-userProfile-employment.component';

import { HelperService } from '../../../shared/helpers/helper.service'; // Adjust the path as necessary
import { ViewUserProfileWizardComponent } from './view-userProfile-wizard.component';
import { ChangeProfilePictureComponent } from '../../../shared/layout/profile/change-profile-picture.component';
import { UserProfileUserLookupTableModalComponent } from './userProfile-user-lookup-table-modal.component';
import { DateTimeService } from '../../../shared/common/timing/date-time.service';
import { type } from 'os';
import { update } from 'lodash-es';


@Component({
    selector: 'viewUserProfileOnboard',
    templateUrl: './view-userProfile-onboard.component.html',
    styleUrls: ['../../str.component.css'],
})
export class ViewUserProfileOnboardComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('userProfileUserLookupTableModal', { static: true })
    userProfileUserLookupTableModal: UserProfileUserLookupTableModalComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    stepId = 1
    active = false;
    saving = false;
    verify = false;

    userProfile: CreateOrEditUserProfileDto = new CreateOrEditUserProfileDto();

    years: number[] = [];
    userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");

    userName = '';
    uploadedFiles: any[] = [];

    countries: any[] = [];
    industries: any[] = [];
    roles: any[] = [];

    selectedIndustries: any[] = []; // To hold the selected industries
    preferredIndustries: any[] = []; // To hold the selected industries

    selectedRoles: any[] = []; // To hold the selected industries
    preferredRoles: any[] = []; // To hold the selected industries

    selectedLocations: any[] = []; // To hold the selected industries
    preferredlocation: any[] = []; // To hold the selected industries
    currentStepStatus: string = 'complete';
    verificationInputValue: string = '';
    verificationInput = false;
    // Add a property to track the progress
    progress: { group1: string, group2: string, group3: string } = { group1: 'active', group2: 'inactive', group3: 'inactive' };

    private debounceSave = new Subject<any>();

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _dateTimeService: DateTimeService,
        private http: HttpClient,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private _helperService: HelperService,
    ) {
        super(injector);

        this.debounceSave.pipe(
            debounceTime(2000) // Set the debounce time as per your requirement
        ).subscribe(event => {
            this.save();
        });

    }

    getCurrentStepStatus(stepId: number): any {
        const groups = [
            [1, 2, 3],
            [4, 5],  
            [6, 7]      
        ];
    }

    // Call this method whenever the step changes
    updateProgressBar(stepId: number): void {
        this.currentStepStatus = this.getCurrentStepStatus(stepId);
    }


    registerToEvents() {
        this.subscribeToEvent('profilePictureChanged', () => {
            //this.getProfilePicture();
        });
    }

    reload() {
        this.show(this.userProfileId);
    }

    show(userProfileId?: string): void {
        if (!userProfileId) {
            this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
                userProfileId = result;
                if (!userProfileId || userProfileId === '00000000-0000-0000-0000-000000000000') { // new user , user profile nehi hai 

                    this.createUserProfile();
                } else {
                    this.loadUserProfile(userProfileId);
                }
            });
        }
        else {
            this.loadUserProfile(userProfileId);
        }
    }

    createUserProfile() {

        this.userProfile = new CreateOrEditUserProfileDto({
            profileName: this.appSession.user.name + ' ' + this.appSession.user.surname,
            profileRole: "",
            profileDescription: "",
            resume: "",
            parsedResume: null, // Assuming you have a ParsedResume class
            chatGPTRecommendation: "",
            archive: false,
            active: true,
            userId: this.appSession.userId,
            skills: "",
            currentLocation: "",
            currentRole: "",
            currentIndustry: "",
            currentSalaryBandLow: 80000,
            currentSalaryBandHigh: 120000,
            preferredLocation: "",
            preferredRole: "",
            preferredIndustry: "",
            preferredSalaryBandLow: 100000,
            preferredSalaryBandHigh: 150000,
            attachedFile: "",
            certificates: "",
            score: 0,
            ranking: 0,
            rankingTotal: 0,
            id: this.generateGuid(),
        });

        this.initParsedResume();

        this._userProfilesServiceProxy
            .createOrEdit(this.userProfile)
            .pipe(
                finalize(() => {
                    this.loadUserProfile(this.userProfile.id);
                    this.saving = false;
                })
            )
            .subscribe(() => {

            });
    }

    loadUserProfile(userProfileId?: string) {
        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {
            this.userProfile = result.userProfile;
            this.userProfile.profileName = this._helperService.titleCaseTransform(this.userProfile.parsedResume.contactInformation.candidateName.formattedName);
            this.userName = this._helperService.titleCaseTransform(result.userName);
            this.active = true;
            this.selectedIndustries = this._helperService.transformArrayItems(this.parseJSONIfNotNull(this.userProfile?.currentIndustry));
            this.preferredIndustries = this._helperService.transformArrayItems(this.parseJSONIfNotNull(this.userProfile?.preferredIndustry));
            this.selectedLocations = this.parseJSONIfNotNull(this.userProfile?.currentLocation);
            this.selectedRoles = this.parseJSONIfNotNull(this.userProfile?.currentRole);
            this.preferredlocation = this.parseJSONIfNotNull(this.userProfile?.preferredLocation);
            this.preferredRoles = this.parseJSONIfNotNull(this.userProfile?.preferredRole);

            //this.selectedSkills = this.userprofile.userProfile.skills ? this.parseJSONIfNotNull(this.userprofile?.userProfile.skills) : [];
            //this.selectedCertificates = this.userprofile.userProfile.certificates ? this.parseJSONIfNotNull(this.userprofile?.userProfile.certificates) : [];

        });
    }
    parseJSONIfNotNull(jsonString: string | undefined | null): any[] {
        if (jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                console.error("Error parsing JSON", e);
                return [];
            }
        } else {
            return [];
        }
    }

    initParsedResume() {
        let e = new ParsedResume();
        e.init({
            contactInformation: ContactInformation.fromJS({
                candidateName: PersonName.fromJS({
                    formattedName: this.appSession.user.name + ' ' + this.appSession.user.surname,
                    prefix: "",
                    givenName: this.appSession.user.name,
                    middleName: "",
                    moniker: "",
                    familyName: this.appSession.user.surname,
                    suffix: ""
                }),

                telephones: [Telephone.fromJS({
                    internationalCountryCode: '',
                    areaCityCode: '',
                    subscriberNumber: this.appSession.user.phoneNumber,
                    raw: '',
                    normalized: this.appSession.user.phoneNumber,
                })],
                emailAddresses: [this.appSession.user.emailAddress],
                location: SovrenLocation.fromJS({
                    countryCode: "",
                    postalCode: "",
                    regions: [],
                    municipality: "",
                    streetAddressLines: [],
                    geoCoordinates: GeocodedCoordinates.fromJS({
                        latitude: 34.0736,
                        longitude: -118.4004
                    })
                }),
                webAddresses: []
            }),
            skillsData: [],
            certifications: [],
            licenses: [],
            associations: [],
            languageCompetencies: [],
            militaryExperience: [],
            securityCredentials: [],
            references: [],
            achievements: [],
            qualificationsSummary: "",
            hobbies: "",
            patents: "",
            publications: "",
            speakingEngagements: "",
            userDefinedTags: []
        });

        this.userProfile.parsedResume = e;

    }

    save(): void {

        this.saving = true;
        this.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        this.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
        this.userProfile.currentLocation = JSON.stringify(this.selectedLocations);
        this.userProfile.preferredLocation = JSON.stringify(this.preferredlocation);
        this.userProfile.currentRole = JSON.stringify(this.selectedRoles);
        this.userProfile.preferredRole = JSON.stringify(this.preferredRoles);

        this._userProfilesServiceProxy
            .createOrEdit(this.userProfile)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('UploadedSuccessfully'));
                this.router.navigate(['/app/main/userProfiles/userProfiles/' + this.userProfile.id + '/view']);
                this.modalSave.emit(null);
            });
    }

    openSelectUserModal() {
        this.userProfileUserLookupTableModal.id = this.userProfile.userId;
        this.userProfileUserLookupTableModal.displayName = this.userName;
        this.userProfileUserLookupTableModal.show();
    }

    setUserIdNull() {
        this.userProfile.userId = null;
        this.userName = '';
    }

    getNewUserId() {
        this.userProfile.userId = this.userProfileUserLookupTableModal.id;
        this.userName = this.userProfileUserLookupTableModal.displayName;
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    ngOnInit(): void {

        // Load countries data from JSON file
        this.http.get<any[]>('./assets/countries.json').subscribe(data => {
            this.countries = data;
        });

        // Load countries data from JSON file
        this.http.get<any[]>('./assets/industries.json').subscribe(data => {
            this.industries = data;
        });

        // Load countries data from JSON file
        this.http.get<any[]>('./assets/roles.json').subscribe(data => {
            this.roles = data;
        });

        this.reload();


        //this.getProfilePicture();
        this.registerToEvents();

    }

    handleFileInput(event: any): void {
        const file = event.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const byteArray = new Uint8Array(e.target.result);
                //const base64String = btoa(String.fromCharCode(...byteArray));  // This has some issues with memory size and were not able to convert Base64String 
                // Convert Uint8Array to Blob
                const blob = new Blob([byteArray]);

                // Read the Blob as a data URL
                const reader = new FileReader();

                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        // The result is a base64-encoded string
                        const base64String = reader.result.split(',')[1];

                        // Now set the userProfile.resume
                        this.userProfile.resume = base64String;

                        this._userProfilesServiceProxy
                            .createOrEdit(this.userProfile)
                            .pipe(
                                finalize(() => {
                                    this.loadUserProfile(this.userProfile.id);
                                    this.saving = false;
                                })
                            )
                            .subscribe(() => {
                            });
                    } else {
                        console.error('Unexpected result type.');
                    }
                };

                reader.readAsDataURL(blob);
            };

            reader.readAsArrayBuffer(file);
        }
    }
    onMultiSelectChange(event: any): void {
        //  this.debounceSave.next(event); // Emit the event through the debounced subject
    }

    onMultiSelectChangeDebounced(event: any): void {
        //this.save();
    }

    formattedSalary: string;

    onSalaryChange(value: string, propertyName: string) {
        this.formattedSalary = value;
        this.userProfile[propertyName] = this.parseSalary(value);
    }

    formatSalary(salary: number): string {
        if (salary == null) return '';
        return salary.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    parseSalary(formattedSalary: string): number {
        return Number(formattedSalary.replace(/,/g, ''));
    }

    beforeSendHandler(event): void {
        //event.xhr.abort(); // This will cancel the default upload
        //this.save();
    }

    addNewEmailAddress(): void {
        if (!this.userProfile.parsedResume.contactInformation.emailAddresses) {
            this.userProfile.parsedResume.contactInformation.emailAddresses = [];
        }
        this.userProfile.parsedResume.contactInformation.emailAddresses.push('');
    }

    removeEmailAddress(event, i): void {
        if (
            this.userProfile.parsedResume.contactInformation.emailAddresses &&
            i >= 0 &&
            i < this.userProfile.parsedResume.contactInformation.emailAddresses.length
        ) {
            this.userProfile.parsedResume.contactInformation.emailAddresses.splice(i, 1);
        }
    }

    trackByEmail(index: number, email: string): string {
        return email;
    }

    addNewPhone(): void {
        if (!this.userProfile.parsedResume.contactInformation.telephones) {
            this.userProfile.parsedResume.contactInformation.telephones = [];
        }

        let t = new Telephone();

        this.userProfile.parsedResume.contactInformation.telephones.push(t);
    }

    removePhone(event, i): void {
        if (
            this.userProfile.parsedResume.contactInformation.telephones &&
            i >= 0 &&
            i < this.userProfile.parsedResume.contactInformation.telephones.length
        ) {
            this.userProfile.parsedResume.contactInformation.telephones.splice(i, 1);
        }
    }

    onIndustrySelect(industry) {
        this.selectedIndustries.push({ "name": industry.value.name });
        this.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
    }

    removeSelectedIndustry(index: number): void {
        if (index !== -1) {
            this.selectedIndustries.splice(index, 1);
            this.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        }
    }

    onPreferredIndustrySelect(industry) {
        this.preferredIndustries.push({ "name": industry.value.name });
        this.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
    }

    removePreferredSelectedIndustry(index: number): void {
        if (index !== -1) {
            this.preferredIndustries.splice(index, 1);
            this.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
        }
    }

    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    trackByFn(index: number, item: any): any {
        return index;
    }

    isGroup1Vistited = false;
    isGroup2Vistited = false;
    isGroup3Vistited = false;

    goToPrevious() {
        if (this.stepId > 1) {
            // this.updateProgress();
            this.updateProgressPrev();
            this.stepId--;
        }
    }

    goToNext() {
        if (this.stepId < 9) {
            this.stepId++;
            if (!this.isGroup1Vistited || !this.isGroup2Vistited || !this.isGroup3Vistited) {
                this.updateProgress();
            }
            else {
                this.updateProgressPrev();
            }
        }
    }

    // Update progress based on stepId
    updateProgress() {
        debugger;
        if(this.isGroup1Vistited && this.isGroup2Vistited && this.isGroup3Vistited){
            this.progress = { group1: 'complete', group2: 'complete', group3: 'complete' };
        }
        else{
            if (this.stepId >= 1 && this.stepId < 4) {
                this.progress = { group1: 'active', group2: 'inactive', group3: 'inactive' };
                if(!this.isGroup1Vistited){
                    this.isGroup1Vistited = true;
                }
            } else if (this.stepId >= 4 && this.stepId < 6) {
                this.progress = { group1: 'complete', group2: 'active', group3: 'inactive' };
                this.isGroup2Vistited = true;
            } 
            else if (this.stepId >= 6 && this.stepId < 7) {
                this.progress = { group1: 'complete', group2: 'complete', group3: 'active' };
                this.isGroup3Vistited = true;
            }
            else if (this.stepId >=7 && this.stepId < 8) {
                this.progress = { group1: 'complete', group2: 'complete', group3: 'complete' };
                this.isGroup3Vistited = true;
            }
        }
    }

    updateProgressPrev() {
        if(this.isGroup1Vistited && this.isGroup2Vistited && this.isGroup3Vistited){
            this.progress = { group1: 'complete', group2: 'complete', group3: 'complete' };
        }
    }

    isGroupComplete(group: string): boolean {
        if (group === 'group3') {
            return this.areGroup3FieldsFilled();
        } else if (group === 'group2') {
            return this.areGroup2FieldsFilled();
        } else if (group === 'group1') {
            return this.areGroup1FieldsFilled();
        }
        return false;
    }

    areGroup3FieldsFilled(): boolean {
        this.isGroup3Vistited = true;
        this.updateProgress();
        return this.verificationInputValue.trim() !== '';

    }

    areGroup2FieldsFilled(): boolean {
        this.isGroup2Vistited = true;
        this.updateProgress();
        return (
            this.selectedIndustries &&
            this.selectedIndustries.length > 0 &&
            this.preferredIndustries &&
            this.preferredIndustries.length > 0 &&
            typeof this.userProfile.currentSalaryBandHigh === 'number' &&
            typeof this.userProfile.preferredSalaryBandHigh === 'number'
        );
    }

    areGroup1FieldsFilled(): boolean {
        this.updateProgress();
        this.isGroup1Vistited = true;
        return (
            this.userProfile &&
            this.userProfile.parsedResume &&
            this.userProfile.parsedResume.contactInformation &&
            this.userProfile.parsedResume.contactInformation.emailAddresses &&
            this.userProfile.parsedResume.contactInformation.emailAddresses.length > 0 &&
            typeof this.userProfile.currentSalaryBandLow === 'number' &&
            typeof this.userProfile.preferredSalaryBandLow === 'number'
        );
    }

    onCompletion() {
        this.progress = { group1: 'complete', group2: 'complete', group3: 'complete' };
        this.verificationInputValue;
        this.verify = true;
    }
}

class UserProfileCertificate {
    userProfileId: string;
    id: string;
    name: string;
    issuer: string;
    date: string;

    constructor(userProfileId: string, id: string, name: string, issuer: string, date: string) {
        this.userProfileId = userProfileId;
        this.id = id;
        this.name = name;
        this.issuer = issuer;
        this.date = date;
    }
}