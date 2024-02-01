import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyNameWithProbability, EducationDetails, EducationHistory, Employer, GetUserProfileForEditOutput, GetUserProfileForViewDto, IPosition, JobTitle, ParsedResume, Position, SovrenDate, Location as SovrenLocation, UserProfileDto, UserProfilesServiceProxy, NormalizedString, Degree, GeocodedCoordinates, SovrenPrimitiveOfInt32, ParsingNormalizedProfession, Bullet, ProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfString, ProfileServiceProxy, Certification, CreateOrEditUserProfileFileDto, Telephone, CreateOrEditUserProfileDto, ICreateOrEditUserProfileDto, PersonName } from '@shared/service-proxies/service-proxies';
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
import { ProfilePictureService } from '../../../shared/layout/profile/profile-picture.service'


@Component({
    selector: 'viewUserProfile2',
    templateUrl: './view-userProfile2.component.html',
    styleUrls: ['../../str.component.css'],
})
export class ViewUserProfile2Component extends AppComponentBase implements OnInit {

    @Input() profileImageCssClass = '';
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('changeprofilepicture', { static: true }) changeProfilePicture: ChangeProfilePictureComponent
    @ViewChild('createOrEditUserProfileModal', { static: true }) createOrEditUserProfileModal: CreateOrEditUserProfileModalComponent;
    @ViewChild('CreateOrEditUserProfileEducationComponent', { static: true }) CreateOrEditUserProfileEducationComponent: CreateOrEditUserProfileEducationComponent;
    @ViewChild('CreateOrEditUserProfileEmploymentComponent', { static: true }) CreateOrEditUserProfileEmploymentComponent: CreateOrEditUserProfileEmployment;

    years: number[] = [];

    active = false;
    saving = false;

    userprofile: GetUserProfileForEditOutput;
    selectedCertificate: UserProfileCertificate;
    selectedEducation: EducationDetails
    selectedPosition: Position;
    selectedItemChanged = false;
    isNextTab = false;

    tabId = 1;
    prevtabId = 1
    edit = false;
    editCert = false;

    userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

    countries: any[] = [];
    industries: any[] = [];
    roles: any[] = [];

    uploadedFiles: any[] = [];

    private debounceSave = new Subject<any>();

    constructor(
        injector: Injector,
        private profilePictureService: ProfilePictureService,
        private router: Router,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private _helperService: HelperService,
        private _profileServiceProxy: ProfileServiceProxy,
    ) {
        super(injector);

        this.userprofile = new GetUserProfileForEditOutput();

        this.debounceSave.pipe(
            debounceTime(2000) // Set the debounce time as per your requirement
        ).subscribe(event => {
            this.save();
        });

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
        this.reload();
        this.getProfilePicture();
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

    createUserProfile(): void {

        var userprofile = new CreateOrEditUserProfileDto({
            profileName: "",
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
            id: this.generateGuid()
        });

        this._userProfilesServiceProxy
            .createOrEdit(userprofile)
            .pipe(
                finalize(() => {
                    this.loadUserProfile(userprofile.id);
                    this.saving = false;
                })
            )
            .subscribe(() => {

            });

    }

    loadUserProfile(userProfileId?: string) {

        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {
            this.userprofile = result;
            this.userProfileId = result.userProfile.id;

            if (this.userprofile.userProfile) {
                this.initMissingProperties(this.userprofile.userProfile);

                this.selectedIndustries = this._helperService.transformArrayItems(this.parseJSONIfNotNull(this.userprofile.userProfile.currentIndustry));
                this.preferredIndustries = this._helperService.transformArrayItems(this.parseJSONIfNotNull(this.userprofile.userProfile.preferredIndustry));
                this.selectedLocations = this.parseJSONIfNotNull(this.userprofile.userProfile.currentLocation);
                this.selectedRoles = this.parseJSONIfNotNull(this.userprofile.userProfile.currentRole);
                this.preferredlocation = this.parseJSONIfNotNull(this.userprofile.userProfile.preferredLocation);
                this.preferredRoles = this.parseJSONIfNotNull(this.userprofile.userProfile.preferredRole);
                this.selectedSkills = this._helperService.transformArrayItems(this.parseJSONIfNotNull(this.userprofile.userProfile.skills));
                this.selectedCertificates = this.parseJSONIfNotNull(this.userprofile.userProfile.certificates);

                this.userprofile.userProfile.parsedResume.skills.raw = this._helperService.transformArrayItems(this.userprofile.userProfile.parsedResume.skills.raw);
            } else {
                // Handle the case when the string is empty or undefined
                console.error("Invalid JSON string: ", this.userprofile.userProfile);
            }
        });

    }



    initMissingProperties(userProfile: CreateOrEditUserProfileDto) {

        if (userProfile.parsedResume.contactInformation.candidateName === null) {
            userProfile.parsedResume.contactInformation.candidateName = PersonName.fromJS({
                formattedName: "",
                prefix: "",
                givenName: "",
                middleName: "",
                moniker: "",
                familyName: "",
                suffix: ""
            })
        }

        if (userProfile.parsedResume.contactInformation.location === null) {
            userProfile.parsedResume.contactInformation.location = SovrenLocation.fromJS({
                countryCode: "",
                postalCode: "",
                regions: [],
                municipality: "",
                streetAddressLines: [],
                geoCoordinates: GeocodedCoordinates.fromJS({
                    latitude: 0,
                    longitude: 0
                })
            });
        }

        if (userProfile.parsedResume.contactInformation.telephones === null) {
            userProfile.parsedResume.contactInformation.telephones = [];
        }

        if (userProfile.parsedResume.contactInformation.emailAddresses === null) {
            userProfile.parsedResume.contactInformation.emailAddresses = [];
        }

        if (userProfile.parsedResume.skillsData === null) {
            userProfile.parsedResume.skillsData = [];
        }

        if (userProfile.parsedResume.certifications === null) {
            userProfile.parsedResume.certifications = [];
        }

        if (userProfile.parsedResume.licenses === null) {
            userProfile.parsedResume.licenses = [];
        }

        if (userProfile.parsedResume.associations === null) {
            userProfile.parsedResume.associations = [];
        }

        if (userProfile.parsedResume.languageCompetencies === null) {
            userProfile.parsedResume.languageCompetencies = [];
        }

        if (userProfile.parsedResume.militaryExperience === null) {
            userProfile.parsedResume.militaryExperience = [];
        }

        if (userProfile.parsedResume.securityCredentials === null) {
            userProfile.parsedResume.securityCredentials = [];
        }

        if (userProfile.parsedResume.references === null) {
            userProfile.parsedResume.references = [];
        }

        if (userProfile.parsedResume.achievements === null) {
            userProfile.parsedResume.achievements = [];
        }

        if (userProfile.parsedResume.qualificationsSummary === null) {
            userProfile.parsedResume.qualificationsSummary = "";
        }

        if (userProfile.parsedResume.hobbies === null) {
            userProfile.parsedResume.hobbies = "";
        }

        if (userProfile.parsedResume.patents === null) {
            userProfile.parsedResume.patents = "";
        }

        if (userProfile.parsedResume.publications === null) {
            userProfile.parsedResume.publications = "";
        }

        if (userProfile.parsedResume.speakingEngagements === null) {
            userProfile.parsedResume.speakingEngagements = "";
        }

        if (userProfile.parsedResume.userDefinedTags === null) {
            userProfile.parsedResume.userDefinedTags = [];
        }

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
    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe((result) => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    transformText(text: string): string {
        var result = '';
        if (text != null) {
            result = text.replace(/\n/g, '<br>');
            result = text.replace(/\\n/g, '<br>');
        }
        return result;
    }

    //createUserProfile(): void {
    //    this.createOrEditUserProfileModal.show(this.userprofile.userProfile.id);
    //}

    //showUserProfileWizard(): void {     
    //    
    //    this.ViewUserProfileWizardComponent.show(this.userprofile);
    //}

    save(options: { selectTab: boolean } = { selectTab: true }): void {

        this.saving = true;

        this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        this.userprofile.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
        this.userprofile.userProfile.currentLocation = JSON.stringify(this.selectedLocations);
        this.userprofile.userProfile.preferredLocation = JSON.stringify(this.preferredlocation);
        this.userprofile.userProfile.currentRole = JSON.stringify(this.selectedRoles);
        this.userprofile.userProfile.preferredRole = JSON.stringify(this.preferredRoles);
        this.userprofile.userProfile.certificates = JSON.stringify(this.selectedCertificates);

        // Check if selectedEducation is already in the educationDetails array
        if (this.selectedEducation) {
            const educationExists = this.userprofile.userProfile.parsedResume.education.educationDetails.find((educationDetail) => {
                return educationDetail.id === this.selectedEducation.id; // Assuming each education detail has a unique 'id' property

            });

            // If selectedEducation is not in the array, add it
            if (!educationExists) {
                this.userprofile.userProfile.parsedResume.education.educationDetails.push(this.selectedEducation);
            }
        }

        if (this.selectedPosition) {
            // Check if selectedPosition is already in the positions array
            const positionExists = this.userprofile.userProfile.parsedResume.employmentHistory.positions.find((position) => {
                return position.id === this.selectedPosition.id; // Replace 'id' with the actual unique identifier property
            });

            // If selectedPosition is not in the array, add it
            if (!positionExists) {
                this.userprofile.userProfile.parsedResume.employmentHistory.positions.push(this.selectedPosition);
            }
        }

        if (this.selectedCertificate) {
            // Check if selectedCertificate is already in the selectedCertificates array
            const certExists = this.selectedCertificates.find((cert) => {
                return cert.id === this.selectedCertificate.id; // Replace 'id' with the actual unique identifier property
            });

            // If selectedCertificate is not in the array, add it
            if (!certExists) {
                this.selectedCertificates.push(this.selectedCertificate);
            }
        }

        this.userprofile.userProfile.certificates = JSON.stringify(this.selectedCertificates);

        this.profilePictureService.sendProfileData(true);
        this._userProfilesServiceProxy
            .createOrEdit(this.userprofile.userProfile)
            .pipe(
                finalize(() => {
                    this.saving = false;
                    if (options.selectTab) this.selectPrevTab();

                })
            )
            .subscribe(() => {
                this.notify.info(this.l('Saved'));
            });

    }

    selectPrevTab() {

        if (this.tabId == 8 || this.tabId == 13 || this.tabId == 15) {
            this.tabId--;
            this.prevtabId = 1
        }
        else {
            this.tabId = 1;
            this.prevtabId = 1
            this.edit = false;
            this.editCert = false;
        }
    }

    updateName(newName: string) {
        // Update the Angular object here
        this.userprofile.userProfile.profileName = newName; this.save();
    }

    getNewEducationDetail() {

        let e = new EducationDetails();
        e.init({
            id: this._helperService.generateGUID(),
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

        return e;

    }

    deleteEducationDetails(item) {
        const index = this.userprofile.userProfile.parsedResume.education.educationDetails.indexOf(item);
        if (index > -1) {
            this.userprofile.userProfile.parsedResume.education.educationDetails.splice(index, 1);
            this.selectedEducation = undefined;
            this.save({ selectTab: false });
        }
    }

    createNewPosition() {

        let p = new Position();
        p.init({
            id: this._helperService.generateGUID(),
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

        return p;
    }

    deleteEmployment(item) {
        const index = this.userprofile.userProfile.parsedResume.employmentHistory.positions.indexOf(item);
        if (index > -1) {
            this.userprofile.userProfile.parsedResume.employmentHistory.positions.splice(index, 1);
            this.selectedPosition = undefined;
            this.save({ selectTab: false });
        }
    }

    createOrEditEmployment(position: Position): void {

        this.tabId = 13; this.edit = true; this.isNextTab = true
        if (position === null) {
            this.selectedPosition = this.createNewPosition();
        }
        else {
            this.selectedPosition = position;
        }
    }

    educationNavOpen = false;
    CreateOrEditEducation(userprofile, education) {

        this.tabId = 8; this.edit = true; this.isNextTab = true
        if (education === null) {
            this.selectedEducation = this.getNewEducationDetail();
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
    onSalaryChange(value: string, propertyName: string) {
        this.formattedSalary = value;
        this.userprofile.userProfile[propertyName] = this.parseSalary(value);
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
        this.selectedSkills = this._helperService.transformArrayItems(this.selectedSkills);
        this.userprofile.userProfile.skills = JSON.stringify(this.selectedSkills);
    }

    onSkillSelect(skill) {
        this.selectedSkills.push(skill.value.name);
        this.selectedSkills = this._helperService.transformArrayItems(this.selectedSkills);
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
        this.selectedIndustries.push({ "name": industry.value.name });
        this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
    }

    removeSelectedIndustry(index: number): void {
        if (index !== -1) {
            this.selectedIndustries.splice(index, 1);
            this.userprofile.userProfile.currentIndustry = JSON.stringify(this.selectedIndustries);
        }
    }

    onPreferredIndustrySelect(industry) {
        this.preferredIndustries.push({ "name": industry.value.name });
        this.userprofile.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
    }

    removeSelectedPreferredIndustry(index: number): void {
        if (index !== -1) {
            this.preferredIndustries.splice(index, 1);
            this.userprofile.userProfile.preferredIndustry = JSON.stringify(this.preferredIndustries);
        }
    }

    onLocationSelect(item) {
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
        this.isNextTab = true;
        if (cert === null) {
            this.selectedCertificate = new UserProfileCertificate(
                this.userProfileId,
                this.generateGuid(),
                "",
                "",
                ""
            );
        }
        else {
            this.selectedCertificate = cert;
        }
    }

    deleteCertificate(item) {

        const index = this.selectedCertificates.indexOf(item);
        if (index > -1) {
            this.selectedCertificates.splice(index, 1);
            this.selectedCertificate = undefined;
            this.save({ selectTab: false });
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

    public onEndYearChange(position: Position, newYear: any): void {
        // Handle the end year change here
        // You might need to create a new date object and assign it to position.endDate
        position.endDate.date = DateTime.fromJSDate(new Date(newYear, 1, 1));
    }

    public getEndYear(year: number) {

        if (year == 2100) {
            return 'Present';
        }
        else {
           return year;
        }

    }

    months = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 }
    ];


    onStartMonthChange(position: any, newMonthValue: number): void {
        // Update the position's start date month with the new value
        if (position && position.startDate && position.startDate.date) {
            position.startDate.date.month = newMonthValue;
        }
    }

    onEndMonthChange(position: any, newMonthValue: number): void {
        // Update the position's start date month with the new value
        if (position && position.endDate && position.endDate.date) {
            position.endDate.date.month = newMonthValue;
        }
    }

    getMonthName(monthNumber: number, yearNumber: number): string {

        if (yearNumber == 2100) {
            return '';
        }

        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Subtract 1 to get the correct index (e.g., January is 0, February is 1, etc.)
        const monthIndex = monthNumber - 1;

        if (monthIndex >= 0 && monthIndex < 12) {
            return monthNames[monthIndex];
        } else {
            // Handle invalid month number
            return '';
        }
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

    removeEmailAddress(event, i): void {
        if (
            this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses &&
            i >= 0 &&
            i < this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses.length
        ) {
            this.userprofile.userProfile.parsedResume.contactInformation.emailAddresses.splice(i, 1);
        }
    }


    addNewPhone(): void {
        if (!this.userprofile.userProfile.parsedResume.contactInformation.telephones) {
            this.userprofile.userProfile.parsedResume.contactInformation.telephones = [];
        }

        let t = new Telephone();

        this.userprofile.userProfile.parsedResume.contactInformation.telephones.push(t);
    }

    removePhone(event, i): void {
        if (
            this.userprofile.userProfile.parsedResume.contactInformation.telephones &&
            i >= 0 &&
            i < this.userprofile.userProfile.parsedResume.contactInformation.telephones.length
        ) {
            this.userprofile.userProfile.parsedResume.contactInformation.telephones.splice(i, 1);
        }
    }

    trackByFn(index: number, item: any): any {
        return index;
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