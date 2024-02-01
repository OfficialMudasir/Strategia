import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CompanyNameWithProbability, EducationDetails, EducationHistory, Employer, GetUserProfileForEditOutput, GetUserProfileForViewDto, IPosition, JobTitle, ParsedResume, Position, SovrenDate, Location as SovrenLocation, UserProfileDto, UserProfilesServiceProxy, NormalizedString, Degree, GeocodedCoordinates, SovrenPrimitiveOfInt32, ParsingNormalizedProfession, Bullet, ProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfInt32, VersionedNormalizedProfessionClassificationOfString } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditUserProfileModalComponent } from './create-or-edit-userProfile-modal.component';
import { finalize, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateOrEditUserProfileEducationComponent } from './create-or-edit-userProfile-education.component';
import { FormControl } from '@angular/forms';

import { startWith, map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { CreateOrEditUserProfileEmployment } from './create-or-edit-userProfile-employment.component';

import { HelperService } from '../../../shared/helpers/helper.service'; // Adjust the path as necessary
import { ViewUserProfileWizardComponent } from './view-userProfile-wizard.component';


@Component({
    selector: 'viewUserProfile',
    templateUrl: './view-userProfile.component.html',
    styleUrls: ['../../str.component.css'],
})
export class ViewUserProfileComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('createOrEditUserProfileModal', { static: true })  createOrEditUserProfileModal: CreateOrEditUserProfileModalComponent;

    @ViewChild('CreateOrEditUserProfileEducationComponent', { static: true }) CreateOrEditUserProfileEducationComponent: CreateOrEditUserProfileEducationComponent;
    @ViewChild('CreateOrEditUserProfileEmploymentComponent', { static: true }) CreateOrEditUserProfileEmploymentComponent: CreateOrEditUserProfileEmployment;

    //@ViewChild('ViewUserProfileWizardComponent', { static: true }) ViewUserProfileWizardComponent: ViewUserProfileWizardComponent;

    active = false;
    saving = false;

    userprofile: GetUserProfileForEditOutput;
 
    tabId = 1

    userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");

    countries: any[] = [];
    industries: any[] = [];
    roles: any[] = [];

    private debounceSave = new Subject<any>();

    constructor(
        injector: Injector,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private helperService: HelperService
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

    }

    reload() {
        this.show(this.userProfileId);
    }

    show(userProfileId?: string): void {
        this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {

            this.userprofile = result; 

            
            this.selectedIndustries = JSON.parse(this.userprofile.userProfile.currentIndustry); 
            this.preferredIndustries = JSON.parse(this.userprofile.userProfile.preferredIndustry); 
            this.selectedLocations = JSON.parse(this.userprofile.userProfile.currentLocation); 
            this.selectedRoles = JSON.parse(this.userprofile.userProfile.currentRole); 
            this.preferredlocation = JSON.parse(this.userprofile.userProfile.preferredLocation); 
            this.preferredRoles = JSON.parse(this.userprofile.userProfile.preferredRole); 

            this.selectedSkills = this.userprofile.userProfile.skills ? JSON.parse(this.userprofile.userProfile.skills) : [];

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
    updateName(newName: string) {
        // Update the Angular object here
        this.userprofile.userProfile.profileName = newName;this.save();
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
        this.openCreateOrEditEducation(this.userprofile, e);
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
        this.openCreateOrEditEmployment(this.userprofile, p);
    }

    deleteEmployment(item) {
        const index = this.userprofile.userProfile.parsedResume.employmentHistory.positions.indexOf(item);
        if (index > -1) {
            this.userprofile.userProfile.parsedResume.employmentHistory.positions.splice(index, 1);
            this.save();
        }
    }

    clicked(args: any): void {
        this.closeCreateOrEditEducation();
        this.closeCreateOrEditEmployment();
    }

    educationNavOpen = false;
    openCreateOrEditEducation(userprofile, employment) {
        this.CreateOrEditUserProfileEducationComponent.show(userprofile, employment);
        document.getElementById("createOrEditUserProfileEducationContent").style.width = "70em";
        this.educationNavOpen = true;
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

    generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
    });
}

}
