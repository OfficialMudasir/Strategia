import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyNameWithProbability, EducationDetails, EducationHistory, Employer, GetUserProfileForEditOutput, GetUserProfileForViewDto, IPosition, JobTitle, ParsedResume, Position, SovrenDate, Location as SovrenLocation, UserProfileDto, UserProfilesServiceProxy, NormalizedString, Degree, GeocodedCoordinates, SovrenPrimitiveOfInt32, ParsingNormalizedProfession, Bullet, ProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfString, ProfileServiceProxy, Certification, CreateOrEditUserProfileFileDto, Telephone, CoursesServiceProxy, GetCourseForViewDto, CourseUsersServiceProxy, PagedResultDtoOfGetCourseUserForViewDto, GetCourseUserForViewDto, CourseGroupDto } from '@shared/service-proxies/service-proxies';
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
import { LazyLoadEvent } from 'primeng/api';

@Component({
    selector: 'viewUserProfileMyCourses',
    templateUrl: './view-userProfile-myCourses.component.html',
    styleUrls: ['../../str.component.css'],
})
export class ViewUserProfileMyCoursesComponent extends AppComponentBase implements OnInit {

    @Input() profileImageCssClass = '';
    @Input() tabId = 1;
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('changeprofilepicture', { static: true }) changeProfilePicture: ChangeProfilePictureComponent
    @ViewChild('createOrEditUserProfileModal', { static: true }) createOrEditUserProfileModal: CreateOrEditUserProfileModalComponent;
    @ViewChild('CreateOrEditUserProfileEducationComponent', { static: true }) CreateOrEditUserProfileEducationComponent: CreateOrEditUserProfileEducationComponent;
    @ViewChild('CreateOrEditUserProfileEmploymentComponent', { static: true }) CreateOrEditUserProfileEmploymentComponent: CreateOrEditUserProfileEmployment;
    @Output() tabIdChange: EventEmitter<number> = new EventEmitter<number>();
    //@ViewChild('ViewUserProfileWizardComponent', { static: true }) ViewUserProfileWizardComponent: ViewUserProfileWizardComponent;

    years: number[] = [];

    active = false;
    saving = false;

    userprofile: GetUserProfileForEditOutput;
    @Input() inputUserProfileId: string = '';

 
    selectedCourseId = '';
    selectedCourseLessonActivityId = '';
    prevtabId = 1
    edit = false;
    editCert = false;
    userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    authorProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    countries: any[] = [];
    industries: any[] = [];
    roles: any[] = [];
    uploadedFiles: any[] = [];
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

    nameFilter = '';
    descriptionFilter = '';
    userNameFilter = '';
    courses: GetCourseForViewDto[];

    myCourses: GetCourseUserForViewDto[];

    private debounceSave = new Subject<any>();
    groupedCourses: CourseGroupDto[];
    filteredCourses: any[];

    isProgress: boolean = true;
    isCompleted: boolean = false;
    
    groupedActiveCourses: CourseGroupDto[] = [];
    groupedCompletedCourses: CourseGroupDto[] = [];

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private helperService: HelperService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _coursesServiceProxy: CoursesServiceProxy,
        private _courseUsersServiceProxy: CourseUsersServiceProxy,
        private router: Router,
    ) {
        super(injector);
        this.userprofile = new GetUserProfileForEditOutput();
    }

    ngOnDestroy(): void {
        this.debounceSave.unsubscribe(); // Clean up the subscription
    }

    skillControl = new FormControl();
    filteredSkills: Observable<string[]>;

    selectedSkills: string[] = [];

    selectedIndustries: any[] = []; // To hold the selected industries
    preferredIndustries: any[] = []; // To hold the selected industries

    selectedRoles: any[] = []; // To hold the selected industries
    preferredRoles: any[] = []; // To hold the selected industries

    selectedLocations: any[] = []; // To hold the selected industries
    preferredlocation: any[] = []; // To hold the selected industries

    selectedCertificates: any[] = [];

    skills = [

        { name: 'Active Listening', code: 'ACT' },
        { name: 'Adaptability', code: 'ADP' },
        { name: 'Affiliate Marketing', code: 'AFF' },
        { name: 'AI and Robotics', code: 'AIR' },
        { name: 'Analytical Skills', code: 'ANA' },
        { name: 'Attention to Detail', code: 'ATD' },
        { name: 'Blockchain', code: 'BLC' },
        { name: 'Branding', code: 'BRD' },
        { name: 'Business Development', code: 'BDS' },
        { name: 'Business Intelligence', code: 'BIZ' },
        { name: 'Cloud Computing', code: 'CLD' },
        { name: 'Collaboration', code: 'CLB' },
        { name: 'Communication', code: 'COM' },
        { name: 'Conflict Resolution', code: 'CFR' },
        { name: 'Content Creation', code: 'CNT' },
        { name: 'Contract Negotiation', code: 'CNT' },
        { name: 'Creativity', code: 'CRT' },
        { name: 'Critical Thinking', code: 'CTH' },
        { name: 'Customer Retention', code: 'CRT' },
        { name: 'Customer Service', code: 'CUS' },
        { name: 'Data Analysis', code: 'DTA' },
        { name: 'Data Mining', code: 'DMI' },
        { name: 'Data Visualization', code: 'DVS' },
        { name: 'Database Management', code: 'DBM' },
        { name: 'Decision Making', code: 'DCM' },
        { name: 'Digital Literacy', code: 'DGL' },
        { name: 'Diversity and Inclusion', code: 'DIV' },
        { name: 'Email Marketing', code: 'EML' },
        { name: 'Emotional Intelligence', code: 'EMI' },
        { name: 'Empathy', code: 'EMP' },
        { name: 'Event Planning', code: 'EVT' },
        { name: 'Financial Literacy', code: 'FNL' },
        { name: 'Flexibility', code: 'FLX' },
        { name: 'Foreign Language', code: 'FOR' },
        { name: 'Graphic Design', code: 'GRD' },
        { name: 'Hardware Development', code: 'HRD' },
        { name: 'Information Security', code: 'INF' },
        { name: 'Initiative', code: 'INI' },
        { name: 'Innovation', code: 'INV' },
        { name: 'Interpersonal Skills', code: 'IPS' },
        { name: 'IT Support', code: 'ITS' },
        { name: 'Lead Generation', code: 'LDG' },
        { name: 'Leadership', code: 'LDR' },
        { name: 'Learning Agility', code: 'LRN' },
        { name: 'Machine Learning', code: 'MLN' },
        { name: 'Marketing Strategy', code: 'MKS' },
        { name: 'Media Buying', code: 'MDB' },
        { name: 'Mobile Development', code: 'MBD' },
        { name: 'Motivation', code: 'MTV' },
        { name: 'Multitasking', code: 'MTS' },
        { name: 'Negotiation', code: 'NGT' },
        { name: 'Networking', code: 'NET' },
        { name: 'Network Management', code: 'NTW' },
        { name: 'Organizational Skills', code: 'ORG' },
        { name: 'Patience', code: 'PAT' },
        { name: 'Planning', code: 'PLN' },
        { name: 'Positive Attitude', code: 'POS' },
        { name: 'Problem-Solving', code: 'PRB' },
        { name: 'Product Management', code: 'PMT' },
        { name: 'Project Management', code: 'PRJ' },
        { name: 'Public Relations', code: 'PR' },
        { name: 'Public Speaking', code: 'PSP' },
        { name: 'Quality Assurance', code: 'QA' },
        { name: 'Reliability', code: 'RLB' },
        { name: 'Research', code: 'RSC' },
        { name: 'Responsibility', code: 'RSP' },
        { name: 'Sales', code: 'SLS' },
        { name: 'Sales Funnel Management', code: 'SFM' },
        { name: 'Search Engine Optimization', code: 'SEO' },
        { name: 'SEO/SEM Marketing', code: 'SEO' },
        { name: 'Social Media Management', code: 'SMM' },
        { name: 'Social Media Marketing', code: 'SMM' },
        { name: 'Software Development', code: 'SFT' },
        { name: 'Statistical Analysis', code: 'STA' },
        { name: 'Teamwork', code: 'TMW' },
        { name: 'Technical Skills', code: 'TCH' },
        { name: 'Time Management', code: 'TMG' },
        { name: 'Transferable Skills', code: 'TRS' },
        { name: 'User Interface Design', code: 'UID' },
        { name: 'Video Production', code: 'VID' },
        { name: 'Visual Design', code: 'VSD' },
        { name: 'Web Development', code: 'WEB' },
        { name: 'Work Ethic', code: 'WET' }
    ];

    // The ngOnInit function
    ngOnInit(): void {
        this.reload();

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

        const currentYear = new Date().getFullYear();
        for (let year = 1940; year <= currentYear; year++) {
            this.years.push(year);
        }

        this.tabId=1
        this.getProfilePicture();
        this.show();
        this.getMyCourses();

        this.registerToEvents();
    }

    cancel() {

        if (this.tabId == 8 || this.tabId == 13 || this.tabId == 15) {
            this.tabId--;
        }
        else {
            this.tabId = 1;
            this.edit = false;
        }
    }

    close() {
        this.tabId = 1;
        this.edit = false;
    }

    registerToEvents() {
        this.subscribeToEvent('profilePictureChanged', () => {
            this.getProfilePicture();
        });
    }

    reload() {
        this.show(this.userProfileId);
    }

    decrementTabId() {
        if (this.tabId > 0) {
            this.tabId--;
        }
    }

    public lessonDisplayCache: { [lessonId: number]: boolean } = {};
    public activityDisplayCache: { [lessonId: number]: boolean } = {};

    

    getMyCourses(event?: LazyLoadEvent) {
        this._courseUsersServiceProxy
            .getAllGroupedByCourseAndLesson(
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
                '',
                0,
                50
            )
            .subscribe((result) => {
                this.groupedCourses = result.items;
                for (let courseItem of this.groupedCourses) {
                    if (!courseItem.courseTitleImage) {
                        courseItem.courseTitleImage = 'assets/common/images/image_not_available.png'
                    }
                    if (courseItem.authorUserName) {
                        this._profileServiceProxy.getProfilePictureByUserName(courseItem.authorUserName).subscribe((result) => {
                            if (result && result.profilePicture) {
                                courseItem.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                            }
                            else {
                                courseItem.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
                            }
                        });
                    }
                    else {
                        courseItem.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
                    }
                };

                let conditionMet = false;  // Flag to indicate if the first true condition has been met

                for (let courseItem of this.groupedCourses) {

                    let activitydisplay = false;

                    for (let lessonItem of courseItem.lessons) {
                        for (let activityItem of lessonItem.activities) {
                            if (!activitydisplay) {
                                if (activityItem.courseLessonActivityCompletedTotal < activityItem.courseLessonActivityTotal || activityItem.courseLessonActivityCompletedTotal == 0) {
                                    activitydisplay = true;
                                }
                                this.activityDisplayCache[activityItem.courseLessonActivityId] = activitydisplay;
                            }
                        }
                        this.lessonDisplayCache[lessonItem.courseLessonId] = activitydisplay
                    }

                    // Group courses by Active and complete
                    //courseItem.courseWatchTimePersentagePerActivity >= 0 && courseItem.courseWatchTimePersentagePerActivity < 100 ?
                    //this.groupedActiveCourses.push(courseItem) : '';
                    //courseItem.courseWatchTimePersentagePerActivity >= 100 ? this.groupedCompletedCourses.push(courseItem) : '';

                    this.filterCourses('inProgress');

                }
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    filterCourses(filterType: string): void {
        if (filterType === 'inProgress') {
            this.filteredCourses = this.groupedCourses.filter(courseItem =>
                courseItem.courseWatchTimePersentagePerActivity >= 0 &&
                courseItem.courseWatchTimePersentagePerActivity < 100);

            this.isProgress = true;
            this.isCompleted = false;

        } else if (filterType === 'completed') {
            this.filteredCourses = this.groupedCourses.filter(courseItem =>
                courseItem.courseWatchTimePersentagePerActivity >= 100);

            this.isProgress = false;
            this.isCompleted = true;

        }
    }

    show(userProfileId?: string): void {
        if (!userProfileId) {
            this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
                userProfileId = result;
                if (!userProfileId || userProfileId === '00000000-0000-0000-0000-000000000000') {
                    //this.createUserProfile();
                } else {
                    this.loadUserProfile(userProfileId);
                }
            });
        }
        else {
            this.loadUserProfile(userProfileId);
        }
    }

    loadUserProfile(userProfileId?: string) {
        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {
            this.userprofile = result;
            this.selectedIndustries = JSON.parse(this.userprofile.userProfile.currentIndustry);
            this.preferredIndustries = JSON.parse(this.userprofile.userProfile.preferredIndustry);
            this.selectedLocations = JSON.parse(this.userprofile.userProfile.currentLocation);
            this.selectedRoles = JSON.parse(this.userprofile.userProfile.currentRole);
            this.preferredlocation = JSON.parse(this.userprofile.userProfile.preferredLocation);
            this.preferredRoles = JSON.parse(this.userprofile.userProfile.preferredRole);

            this.selectedSkills = this.userprofile.userProfile.skills ? JSON.parse(this.userprofile.userProfile.skills) : [];
            this.selectedCertificates = this.userprofile.userProfile.certificates ? JSON.parse(this.userprofile.userProfile.certificates) : [];
        });
    }

    getProfilePictureByUserName(name): void {
        this._profileServiceProxy.getProfilePictureByUserName(name).subscribe((result) => {
            if (result && result.profilePicture) {
                const profilePic = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe((result) => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    handleChildEvent(data: string) {
        this.tabId = 3
        this.selectedCourseLessonActivityId = data;
    }

    // trackBy function as before
    trackLessonById(index: number, courseLesson: any): number {
        return courseLesson.id;
    }

    navigateToFindCourses() {
        this.tabId = 1;
        this.tabIdChange.emit(this.tabId);
    }
}
