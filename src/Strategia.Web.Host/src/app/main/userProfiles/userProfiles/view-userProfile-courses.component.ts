import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyNameWithProbability, EducationDetails, EducationHistory, Employer, GetUserProfileForEditOutput, GetUserProfileForViewDto, IPosition, JobTitle, ParsedResume, Position, SovrenDate, Location as SovrenLocation, UserProfileDto, UserProfilesServiceProxy, NormalizedString, Degree, GeocodedCoordinates, SovrenPrimitiveOfInt32, ParsingNormalizedProfession, Bullet, ProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfString, ProfileServiceProxy, Certification, CreateOrEditUserProfileFileDto, Telephone, CoursesServiceProxy, GetCourseForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditUserProfileModalComponent } from './create-or-edit-userProfile-modal.component';
import { finalize, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateOrEditUserProfileEducationComponent } from './create-or-edit-userProfile-education.component';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { startWith, map } from 'rxjs/operators';
//import { debounceTime } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { CreateOrEditUserProfileEmployment } from './create-or-edit-userProfile-employment.component';

import { HelperService } from '../../../shared/helpers/helper.service'; // Adjust the path as necessary
import { ViewUserProfileWizardComponent } from './view-userProfile-wizard.component';
import { ChangeProfilePictureComponent } from '../../../shared/layout/profile/change-profile-picture.component';
import { LazyLoadEvent } from 'primeng/api';
//import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';



import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { ViewUserProfileMyCoursesComponent } from './view-userProfile-myCourses.component';

@Component({
    selector: 'viewUserProfileCourses',
    templateUrl: './view-userProfile-courses.component.html',
    styleUrls: ['../../str.component.css'],
})
export class ViewUserProfileCoursesComponent extends AppComponentBase implements OnInit {

    @Input() profileImageCssClass = '';
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('changeprofilepicture', { static: true }) changeProfilePicture: ChangeProfilePictureComponent
    @ViewChild('createOrEditUserProfileModal', { static: true }) createOrEditUserProfileModal: CreateOrEditUserProfileModalComponent;
    @ViewChild('CreateOrEditUserProfileEducationComponent', { static: true }) CreateOrEditUserProfileEducationComponent: CreateOrEditUserProfileEducationComponent;
    @ViewChild('CreateOrEditUserProfileEmploymentComponent', { static: true }) CreateOrEditUserProfileEmploymentComponent: CreateOrEditUserProfileEmployment;

    @ViewChild(ViewUserProfileMyCoursesComponent) ViewUserProfileMyCoursesComponent: ViewUserProfileMyCoursesComponent;

    //@ViewChild('ViewUserProfileWizardComponent', { static: true }) ViewUserProfileWizardComponent: ViewUserProfileWizardComponent;

    years: number[] = [];

    active = false;
    saving = false;

    userprofile: GetUserProfileForEditOutput;
    selectedCertificate: UserProfileCertificate;
    selectedEducation: EducationDetails
    selectedPosition: Position;

    selectedCourseId = '';
    selectedCourseLessonActivityId = '';
    searchTerm: string = '';
    searchTerm$ = new Subject<string>();

    tabId = 1;
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

    authorProfilePic: string;

    private debounceSave = new Subject<any>();

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private helperService: HelperService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _coursesServiceProxy: CoursesServiceProxy,
        private _authService: AppAuthService,
        private router: Router
    ) {
        super(injector);

        this.userprofile = new GetUserProfileForEditOutput();

        this.debounceSave.pipe(
            debounceTime(2000) // Set the debounce time as per your requirement
        ).subscribe(event => {
            this.save();
        });

    }

    navigateToProfile() {
        this.router.navigate(['/app/main/userProfiles/userProfiles/view']);
    }

    ngOnDestroy(): void {
        this.debounceSave.unsubscribe(); // Clean up the subscription
    }

    onMultiSelectChange(event: any): void {
        this.debounceSave.next(event); // Emit the event through the debounced subject
    }

    onMultiSelectChangeDebounced(event: any): void {
        this.save();
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

        this.getProfilePicture();
        this.getCourses();
        this.searchTerm$
            .pipe(
                debounceTime(300), // Optional: debounce time to wait for user to stop typing
                distinctUntilChanged() // Optional: only emit if the value has changed
            )
            .subscribe(term => {
                this.filterText = term;
                this.getCourses();
            });
        this.registerToEvents();
    }

    onSearchChange() {
        // Trigger search when the user types (you can add debounce and distinctUntilChanged if needed)
        this.searchTerm$.next(this.searchTerm);
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

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    userNameFilter = '';
    courses: GetCourseForViewDto[];

    getCourses(event?: LazyLoadEvent) {
        this._coursesServiceProxy
            .getAll(
                this.filterText,
                this.nameFilter,
                this.descriptionFilter,
                this.userNameFilter,
                'name asc',
                0,
                99
            )
            .subscribe((result) => {
                this.courses = result.items;

                // Build the list of author profile pictures
                // for (let item of result.items) {
                //        this.getProfilePictureByUserName(item.userName);
                // }

                for (let course of this.courses) {
                    if(!course.course.titleImage){
                        course.course.titleImage = 'assets/common/images/image_not_available.png'
                    }

                    this._profileServiceProxy.getProfilePictureById(course.course.authorProfilePictureId).subscribe((result) => {
                        if (result && result.profilePicture) {
                            course.course.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                        }
                        else {
                            course.course.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
                        }
                    });

                    //if (course.userName) {
                    //    this._profileServiceProxy.getProfilePictureByUserName(course.userName).subscribe((result) => {
                    //        if (result && result.profilePicture) {
                    //            course.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
                    //        }
                    //        else {
                    //            course.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
                    //        }
                    //    });
                    //}
                    //else {
                    //    course.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
                    //}
                }

                //this.primengTableHelper.totalRecordsCount = result.totalCount;
                //this.primengTableHelper.records = result.items;
                //this.primengTableHelper.hideLoadingIndicator();
            });
    }



    show(userProfileId?: string): void {

        if (!userProfileId) {
            this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
                userProfileId = result;
                if (!userProfileId || userProfileId === '00000000-0000-0000-0000-000000000000') {
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

    loadUserProfile(userProfileId?: string) {

        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {

            this.userprofile = result;

            this.selectedIndustries = this.parseJSONIfNotNull(this.userprofile.userProfile.currentIndustry);
            this.preferredIndustries = this.parseJSONIfNotNull(this.userprofile.userProfile.preferredIndustry);
            this.selectedLocations = this.parseJSONIfNotNull(this.userprofile.userProfile.currentLocation);
            this.selectedRoles = this.parseJSONIfNotNull(this.userprofile.userProfile.currentRole);
            this.preferredlocation = this.parseJSONIfNotNull(this.userprofile.userProfile.preferredLocation);
            this.preferredRoles = this.parseJSONIfNotNull(this.userprofile.userProfile.preferredRole);

            this.selectedSkills = this.userprofile.userProfile.skills ? this.parseJSONIfNotNull(this.userprofile.userProfile.skills) : [];
            this.selectedCertificates = this.userprofile.userProfile.certificates ? this.parseJSONIfNotNull(this.userprofile.userProfile.certificates) : [];

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

    authorProfilePictures: string[] = [];

    getProfilePictureByUserName(name): void {
        this._profileServiceProxy.getProfilePictureByUserName(name).subscribe((result) => {
            if (result && result.profilePicture) {
                const profilePic = 'data:image/jpeg;base64,' + result.profilePicture;
                this.authorProfilePictures.push(profilePic);
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

    // transformText(text: string): string {
    //     var result = text.replace(/\n/g, '<br>');
    //     result = text.replace(/\\n/g, '<br>');
    //     return result;
    // }
    transformText(text: string): string {
        var result = '';
        if (text != null) {
            result = text.replace(/\n/g, '<br>');
            result = text.replace(/\\n/g, '<br>');
        }
        return result;
    }
    createUserProfile(): void {
        this.createOrEditUserProfileModal.show(this.userprofile.userProfile.id);
    }

    //showUserProfileWizard(): void {     
    //    debugger;
    //    this.ViewUserProfileWizardComponent.show(this.userprofile);
    //}

    save(): void {

        this.saving = true;

        this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        this.userprofile.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
        this.userprofile.userProfile.currentLocation = JSON.stringify(this.selectedLocations);
        this.userprofile.userProfile.preferredLocation = JSON.stringify(this.preferredlocation);
        this.userprofile.userProfile.currentRole = JSON.stringify(this.selectedRoles);
        this.userprofile.userProfile.preferredRole = JSON.stringify(this.preferredRoles);

        this.userprofile.userProfile.certificates = JSON.stringify(this.selectedCertificates);

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

    updateName(newName: string) {
        // Update the Angular object here
        this.userprofile.userProfile.profileName = newName; this.save();
    }

    addEducation() {

        let e = new EducationDetails();
        e.init({
            id: this.helperService.generateGUID(),
            text: "",
            schoolName: NormalizedString.fromJS({ raw: "", normalized: "" }),
            schoolType: "",
            location: SovrenLocation.fromJS({
                countryCode: "",
                postalCode: "",
                regions: [],
                municipality: "",
                streetAddressLines: ["", ""],
                geoCoordinates: GeocodedCoordinates.fromJS({ latitude: 0, longitude: 0 })
            }),
            degree: Degree.fromJS({ name: NormalizedString.fromJS({ raw: "", normalized: "" }), type: "" }),
            majors: [],
            minors: [],
            gpa: {
                score: "0.0",
                scoringSystem: "0.0",
                maxScore: "0.0",
                minimumScore: "0.0",
                normalizedScore: 0.0
            },
            lastEducationDate: {
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            },
            startDate: {
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            },
            endDate: {
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            },
            graduated: {
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            }
        });

        this.userprofile.userProfile.parsedResume.education.educationDetails.push(e);

    }

    deleteEducationDetails(item) {
        const index = this.userprofile.userProfile.parsedResume.education.educationDetails.indexOf(item);
        if (index > -1) {
            this.userprofile.userProfile.parsedResume.education.educationDetails.splice(index, 1);
            this.save();
        }
    }

    addEmployment() {

        let p = new Position();
        p.init({
            id: this.helperService.generateGUID(),
            employer: Employer.fromJS({
                name: CompanyNameWithProbability.fromJS({
                    probability: "",
                    raw: "",
                    normalized: ""
                }),
                otherFoundName: NormalizedString.fromJS({ raw: "", normalized: "" }),
                location: SovrenLocation.fromJS({
                    countryCode: "",
                    postalCode: "",
                    regions: [],
                    municipality: "",
                    streetAddressLines: ["", ""],
                    geoCoordinates: GeocodedCoordinates.fromJS({ latitude: 0, longitude: 0 })
                })
            }),
            relatedToByDates: [],
            relatedToByCompanyName: [],
            isSelfEmployed: false,
            isCurrent: true,
            jobTitle: JobTitle.fromJS({
                raw: "",
                normalized: "",
                probability: "",
                variations: []
            }),
            startDate: SovrenDate.fromJS({
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            }),
            endDate: SovrenDate.fromJS({
                date: DateTime.local().toString(), // or use a specific date string
                isCurrentDate: true,
                foundYear: true,
                foundMonth: true,
                foundDay: true
            }),
            numberEmployeesSupervised: SovrenPrimitiveOfInt32.fromJS(5),
            jobType: 'Full-time',
            taxonomyName: '',
            subTaxonomyName: '',
            jobLevel: '',
            taxonomyPercentage: 75,
            description: '',
            bullets: [],
            normalizedProfession: ParsingNormalizedProfession.fromJS({
                profession: ProfessionClassificationOfInt32.fromJS({/* profession data */ }),
                group: ProfessionClassificationOfInt32.fromJS({/* group data */ }),
                class: ProfessionClassificationOfInt32.fromJS({/* class data */ }),
                isco: VersionedNormalizedProfessionClassificationOfInt32.fromJS({/* isco data */ }),
                onet: VersionedNormalizedProfessionClassificationOfString.fromJS({/* onet data */ }),
                confidence: 0.95
            })
        });

        this.userprofile.userProfile.parsedResume.employmentHistory.positions.push(p);
        //this.openCreateOrEditEmployment(this.userprofile, p);
    }

    deleteEmployment(item) {
        const index = this.userprofile.userProfile.parsedResume.employmentHistory.positions.indexOf(item);
        if (index > -1) {
            this.userprofile.userProfile.parsedResume.employmentHistory.positions.splice(index, 1);
            this.save();
        }
    }

    createOrEditEmployment(position: Position): void {

        this.tabId = 13; this.edit = true;
        if (position === null) {
            //this.selectedPosition = new Position(

            //);
            //this.selectedPositions.push(this.selectedCertificate)
        }
        else {
            this.selectedPosition = position;
        }
    }

    //clicked(args: any): void {
    //    this.closeCreateOrEditEducation();
    //    this.closeCreateOrEditEmployment();
    //}

    educationNavOpen = false;
    CreateOrEditEducation(userprofile, education) {
        //this.CreateOrEditUserProfileEducationComponent.show(userprofile, employment);
        //document.getElementById("createOrEditUserProfileEducationContent").style.width = "70em";
        //this.educationNavOpen = true;

        this.tabId = 8; this.edit = true;
        if (education === null) {
            //this.selectedPosition = new Position(

            //);
            //this.selectedPositions.push(this.selectedCertificate)
        }
        else {
            this.selectedEducation = education;
        }

    }

    /* Set the width of the side navigation to 0 */
    closeCreateOrEditEducation() {
        this.CreateOrEditUserProfileEducationComponent.close();
        this.educationNavOpen = false;
    }

    employmentNavOpen = false;
    openCreateOrEditEmployment(userprofile, position) {
        this.CreateOrEditUserProfileEmploymentComponent.show(userprofile, position);
        document.getElementById("createOrEditUserProfileEmploymentContent").style.width = "70em";
        this.employmentNavOpen = true;
    }

    /* Set the width of the side navigation to 0 */
    closeCreateOrEditEmployment() {
        this.CreateOrEditUserProfileEmploymentComponent.close();
        this.employmentNavOpen = false;
    }

    formattedSalary: string;
    onSalaryChange(value: string) {
        this.formattedSalary = value;
        this.userprofile.userProfile.currentSalaryBandLow = this.parseSalary(value);
    }

    formatSalary(salary: number): string {
        if (salary == null) return '';
        return salary.toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    parseSalary(formattedSalary: string): number {
        return Number(formattedSalary.replace(/,/g, ''));
    }

    addSkill(skill) {
        this.selectedSkills.push(skill);
        this.userprofile.userProfile.skills = JSON.stringify(this.selectedSkills);
    }

    onSkillSelect(skill) {
        this.selectedSkills.push(skill.value.name);
        this.userprofile.userProfile.skills = JSON.stringify(this.selectedSkills);
    }

    removeSkill(index: number): void {
        // Ensure the userProfile, parsedResume, and skills objects exist
        if (this.userprofile && this.userprofile.userProfile && this.userprofile.userProfile.parsedResume && this.userprofile.userProfile.parsedResume.skills) {
            // Remove the skill at the specified index
            this.userprofile.userProfile.parsedResume.skills.raw.splice(index, 1);
        }
    }

    removeSelectedSkill(index: number): void {
        if (index !== -1) {
            this.selectedSkills.splice(index, 1);
            this.userprofile.userProfile.skills = JSON.stringify(this.selectedSkills);
        }
    }

    onIndustrySelect(industry) {
        debugger;
        this.selectedIndustries.push({ "name": industry.value.name });
        this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
    }

    removeSelectedIndustry(index: number): void {
        if (index !== -1) {
            this.selectedIndustries.splice(index, 1);
            this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        }
    }

    onLocationSelect(item) {
        debugger;
        this.selectedLocations.push({ "name": item.value.name });
        this.userprofile.userProfile.currentLocation = JSON.stringify(this.selectedLocations);
    }

    removeSelectedLocation(index: number): void {
        if (index !== -1) {
            this.selectedLocations.splice(index, 1);
            this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedLocations);
        }
    }



    createOrEditCertificate(cert: UserProfileCertificate): void {

        this.tabId = 15;
        this.edit = true;
        if (cert === null) {
            this.selectedCertificate = new UserProfileCertificate(
                this.userProfileId,
                this.generateGuid(),
                "",
                "",
                ""
            );
            this.selectedCertificates.push(this.selectedCertificate)
        }
        else {
            this.selectedCertificate = cert;
        }
    }

    deleteCertificate(item) {
        const index = this.selectedCertificates.indexOf(item);
        if (index > -1) {
            this.selectedCertificates.splice(index, 1);
            this.save();
        }
    }

    handleFileInput(event: any): void {

        //const file = event.target.files[0];
        // Only Uploads to Temporary File Storage untill Certificate is saved
        const file = event.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {

                const byteArray = new Uint8Array(e.target.result);
                const base64String = btoa(String.fromCharCode(...byteArray));
                this.saving = true;

                let dto = new CreateOrEditUserProfileFileDto({
                    userProfileId: this.userProfileId,
                    fileId: this.selectedCertificate.id,
                    file: base64String,
                    fileName: file.name,
                    id: this.selectedCertificate.id
                });

                this._userProfilesServiceProxy
                    .uploadCertificate(dto)
                    .pipe(
                        finalize(() => {
                            this.saving = false;
                        })
                    )
                    .subscribe(() => {
                        this.notify.info(this.l('Saved'));
                        abp.event.trigger('app.cloudFileUploaded');
                    });

            };
            reader.readAsArrayBuffer(file);
        }
    }

    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public onStartYearChange(position: Position, newYear: number): void {
        // Handle the start year change here
        // You might need to create a new date object and assign it to position.startDate
        position.startDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));

    }

    public onEndYearChange(position: Position, newYear: number): void {
        // Handle the end year change here
        // You might need to create a new date object and assign it to position.endDate
        position.endDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));
    }

    public onEducationStartYearChange(newYear: number): void {
        // Handle the start year change here
        // You might need to create a new date object and assign it to position.startDate

    }

    public onEducationEndYearChange(education: EducationDetails, newYear: number): void {
        // Handle the end year change here
        // You might need to create a new date object and assign it to position.endDate 
        education.endDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));
    }

    addNewEmailAddress(): void {
        if (!this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses) {
            this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses = [];
        }
        this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses.push('');
    }


    addNewPhone(): void {
        if (!this.userprofile.userProfile.parsedResume.contactInformation.telephones) {
            this.userprofile.userProfile.parsedResume.contactInformation.telephones = [];
        }

        let t = new Telephone();

        this.userprofile.userProfile.parsedResume.contactInformation.telephones.push(t);
    }

    handleChildEvent(data: string) {
        this.tabId = 3;
        this.selectedCourseLessonActivityId = data;
    }

    logout(): void {
        this._authService.logout();
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