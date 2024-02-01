import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debounceTime, finalize } from 'rxjs/operators';
import { UserProfilesServiceProxy, CreateOrEditUserProfileDto, ParsedResume, ContactInformation, PersonName, Location as SovrenLocation, GeocodedCoordinates } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { UserProfileUserLookupTableModalComponent } from './userProfile-user-lookup-table-modal.component';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Component({
  selector: 'createOrEditUserProfileModal',
    templateUrl: './create-or-edit-userProfile-modal.component.html',
    styleUrls: ['./create-or-edit-userProfile-modal.component.css'],
})
export class CreateOrEditUserProfileModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('userProfileUserLookupTableModal', { static: true })
  userProfileUserLookupTableModal: UserProfileUserLookupTableModalComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    stepId = 1
    active = false;
    saving = false;

    userProfile: CreateOrEditUserProfileDto = new CreateOrEditUserProfileDto();

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

    private debounceSave = new Subject<any>();

  constructor(
    injector: Injector,
    private _userProfilesServiceProxy: UserProfilesServiceProxy,
      private _dateTimeService: DateTimeService,
      private http: HttpClient
  ) {
      super(injector);

      this.debounceSave.pipe(
          debounceTime(2000) // Set the debounce time as per your requirement
      ).subscribe(event => {
          this.save();
      });

  }
 
  show(userProfileId?: string): void {
    if (!userProfileId) {
      this.userProfile = new CreateOrEditUserProfileDto();
      this.userProfile.id = userProfileId;
      this.userName = '';

      this.active = true;
      this.modal.show();
    } else {
      this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId).subscribe((result) => {
        this.userProfile = result.userProfile;
        this.userName = result.userName;
        this.active = true;
        this.modal.show();
      });
    }
  }

    initParsedResume() {

        let e = new ParsedResume();
        e.init({
            contactInformation: ContactInformation.fromJS({
                candidateName: PersonName.fromJS({
                    formattedName: "",
                    prefix: "",
                    givenName: "",
                    middleName: "",
                    moniker: "",
                    familyName: "",
                    suffix: ""
                }),
                telephones: [],
                emailAddresses: [],
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
            //personalAttributes: PersonalAttributes.fromJS({
            //    // ... personalAttributes data ...
            //}),
            //education: EducationHistory.fromJS({
            //    // ... education data ...
            //}),
            //employmentHistory: EmploymentHistory.fromJS({
            //    // ... employmentHistory data ...
            //}),
            skillsData: [],
            certifications: [],
            licenses: [],
            associations: [],
            languageCompetencies: [],
            militaryExperience: [],
            securityCredentials: [],
            references: [],
            achievements: [],
            //training: TrainingHistory.fromJS({}),
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

    this._userProfilesServiceProxy
      .createOrEdit(this.userProfile)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('UploadedSuccessfully'));
        this.close();
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

    }

    handleFileInput(event: any): void {

        //const file = event.target.files[0];
        const file = event.files[0];       

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const byteArray = new Uint8Array(e.target.result);
                const base64String = btoa(String.fromCharCode(...byteArray));
                this.userProfile.resume = base64String;
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
    onSalaryChange(value: string) {
        this.formattedSalary = value;
        this.userProfile.currentSalaryBandLow = this.parseSalary(value);
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

    // upload completed event
    onUpload(event): void {
        //for (const file of event.files) {
        //    this.uploadedFiles.push(file);
        //}

        //this.save();
    }

    goToPrevious() {
        if (this.stepId > 1) {
            this.stepId--;
        }
        
    }

    goToNext() {
        if (this.stepId < 9) {
            this.stepId++;
        }
    }
}
