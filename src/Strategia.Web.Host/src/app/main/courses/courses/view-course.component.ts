import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    CoursesServiceProxy,
    CourseDto,
    CreateOrEditCourseDto,
    GetCourseForViewDto,
    CourseUsersServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    TokenAuthServiceProxy, GetUserProfileForEditOutput,
    UserProfilesServiceProxy, ProfileServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

import { ViewCourseModalComponent } from './view-course-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConsts } from '@shared/AppConsts';
import { VimeoDetailsDto } from './course.vimeo';
import { debug } from 'console';

@Component({
    selector: 'viewCourse',
    templateUrl: './view-course.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class ViewCourseComponent extends AppComponentBase implements OnInit {
    // @ViewChild('createOrEditCourseModal', { static: true }) createOrEditCourseModal: CreateOrEditCourseModalComponent;
    // @ViewChild('viewCourseModal', { static: true }) viewCourseModal: ViewCourseModalComponent;

    @Output() courseLessonActivitySelected = new EventEmitter<string>();

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('videoElement') videoElement: ElementRef;

    advancedFiltersAreShown = false;
    isDescriptionVisible = false;
    activityVisibility: { [key: string]: boolean } = {};
    videoDuration: number;

    filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    maxProgressFilter: number;
    maxProgressFilterEmpty: number;
    minProgressFilter: number;
    minProgressFilterEmpty: number;
    maxRatingFilter: number;
    maxRatingFilterEmpty: number;
    minRatingFilter: number;
    minRatingFilterEmpty: number;
    maxScoreFilter: number;
    maxScoreFilterEmpty: number;
    minScoreFilter: number;
    minScoreFilterEmpty: number;
    moodleCourseIdFilter = '';
    userNameFilter = '';
    course: CourseDto = new CourseDto();
    courseVeiw: GetCourseForViewDto = new GetCourseForViewDto();
    formattedSkillsDescription: any;
    formattedSkillsOverview: any;
    userprofile: GetUserProfileForEditOutput;
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    authorProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    isEnrolled: boolean = false;
    TenentId: any;
    userProfileID: any;
    enrollText = 'Enroll Now';
    lessonActivityText = 'Activities';
    totalLessonsCount = 0;
    public lessonExpansions: boolean[] = [];
    isAllExpanded: boolean = false;
    expandText='Expand';
    @Input() inputCourseId: string = '';
    @Input() inputUserProfileId: string = '';

    constructor(
        injector: Injector,
        private _coursesServiceProxy: CoursesServiceProxy,
        private _notifyService: NotifyService,
        private _userProfilesServiceProxy: UserProfilesServiceProxy,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _dateTimeService: DateTimeService,
        private sanitizer: DomSanitizer,
        private _profileServiceProxy: ProfileServiceProxy,
        private _courseUsersServiceProxy: CourseUsersServiceProxy,
    ) {
        super(injector);
        this.userprofile = new GetUserProfileForEditOutput();
    }

    ngOnInit(): void {
       
        let courseId = this._activatedRoute.snapshot.paramMap.get('courseId');
        let userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");

        if (!courseId) {
            courseId = this.inputCourseId;
        }
        this.getCourse(courseId);
        if (!userProfileId) {
            userProfileId = this.inputUserProfileId;
        }
        this.isUserProfileCourseEnrolled();
        this.loadUserProfile(userProfileId);
        this.getProfilePicture();
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    titleVideo: any;
    getCourse(courseId?: string): void {
        debugger
        this._coursesServiceProxy.getCourseForView(courseId).subscribe((result) => {
            this.courseVeiw = result;
            this.course = result.course;
            if (!this.course.titleImage) {
                this.course.titleImage = 'assets/common/images/image_not_available.png'
            }
            this.TenentId = result.tenantId;
            this.titleVideo = this.getSafeUrl(this.course.titleVideo);
            this.course.lessonsFk.forEach((lesson, index) => {
                // Assuming each lesson contains CourseLessonActivities array
                let parIndex = index;
                if(lesson.lessonActivityCount == 1){
                    this.lessonActivityText = 'Activity';                    
                }
                this.totalLessonsCount += lesson.lessonActivityCount;
                lesson.activityFk.forEach((activity, index) => {
                    const originalTitleVideo = activity.titleVideo;
              
                    // Then, sanitize the URL for use in the template
                    /*                activity.titleVideo = this.getSafeUrl(originalTitleVideo);*/
                    let indexs = [parIndex, index].join('');
                    setTimeout(() => {
                        if (activity.activityVideoDetails && !activity.activityVideoDetails.includes("Not Found")) {
                            var vimeoVideoActivity = this.parseVimeoDetails(activity.activityVideoDetails);
                            const videoDurationElement = document.createElement('span');
                            videoDurationElement.innerText = vimeoVideoActivity[0].duration;
                            document.getElementById(`videoDuration-${indexs}`).appendChild(videoDurationElement);
                        }
                    }, 1000);
                });
            });
            // Check if the skills description is defined before formatting
            if (this.course) {
                this.formattedSkillsDescription = this.course.skillsDescription;
                this.formattedSkillsOverview = this.course.skillsOverview;
            }
            this.getProfilePictureById(result.course.authorProfilePictureId);
        });
    }

    isUserProfileCourseEnrolled(): void {

        this.isEnrolled = false;

        if (!this.userProfileID) {
            this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
                this.userProfileID = result;
                if (this.userProfileID) {
                    this._coursesServiceProxy
                        .checkUserIsEnrolled(this.inputCourseId, this.userProfileID)
                        .pipe(
                            finalize(() => {
                                console.log("Enrollment process completed.");
                            })
                        )
                        .subscribe(
                            (response) => {
                                this.isEnrolled = response.isEnrolled;
                            },
                            error => {
                                console.error('Error during enrollment:', error);
                            }
                        );
                }
            });
        }
    }

    loadUserProfile(userProfileId?: string): void {
        if (!userProfileId) {
            userProfileId = this.userProfileID;
        }

        this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
            this.userProfileID = result;
            this._userProfilesServiceProxy.getUserProfileForEdit(userProfileId ? userProfileId : this.userProfileID).subscribe((result) => {
                this.userprofile = result;

                // this.selectedIndustries = JSON.parse(this.userprofile.userProfile.currentIndustry); 
                // this.preferredIndustries = JSON.parse(this.userprofile.userProfile.preferredIndustry); 
                // this.selectedLocations = JSON.parse(this.userprofile.userProfile.currentLocation); 
                // this.selectedRoles = JSON.parse(this.userprofile.userProfile.currentRole); 
                // this.preferredlocation = JSON.parse(this.userprofile.userProfile.preferredLocation); 
                // this.preferredRoles = JSON.parse(this.userprofile.userProfile.preferredRole); 

                // this.selectedSkills = this.userprofile.userProfile.skills ? JSON.parse(this.userprofile.userProfile.skills) : [];
                // this.selectedCertificates = this.userprofile.userProfile.certificates ? JSON.parse(this.userprofile.userProfile.certificates) : [];

            });
        });

    }


    getProfilePictureById(profilePictureId): void {

        this._profileServiceProxy.getProfilePictureById(profilePictureId).subscribe((result) => {
            if (result && result.profilePicture) {
                this.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
            else {
                this.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
            }
        });
    }

    getProfilePictureByUserName(name): void {
        this._profileServiceProxy.getProfilePictureByUserName(name).subscribe((result) => {
            if (result && result.profilePicture) {
                this.authorProfilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
            else {
                this.authorProfilePicture = 'assets/common/images/default-profile-picture.png'
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

    toggleDescription(activityId: string) {
        this.isAllExpanded = false;
        this.expandText = "Expand";
        if(!this.activityVisibility[activityId]){
            this.activityVisibility[activityId] = true
        }
        else{
            this.activityVisibility[activityId] = false;
        }
    }
    // Method to toggle the expansion state of all lessons

    toggleAllLessonsExpansion(expand: boolean): void {
        if (!this.isAllExpanded) {
            this.expandText = "Collapse";
            this.isAllExpanded = true;
            this.lessonExpansion(expand);
        }
        else{
            this.expandText = "Expand";
            this.isAllExpanded = false;
            this.lessonExpansion(expand);
        }
    }

    lessonExpansion(expand:boolean):void{
        this.lessonExpansions = this.course.lessonsFk.map((lesson) => {
            return this.activityVisibility[lesson.id] = !expand;
            //return expand;
        });
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    // createCourse(): void {
    //   this.createOrEditCourseModal.show();
    // }

    deleteCourse(course: CourseDto): void {
        this.message.confirm('', this.l('AreYouSure'), (isConfirmed) => {
            if (isConfirmed) {
                this._coursesServiceProxy.delete(course.id).subscribe(() => {
                    this.reloadPage();
                    this.notify.success(this.l('SuccessfullyDeleted'));
                });
            }
        });
    }

    exportToExcel(): void {
        this._coursesServiceProxy
            .getCoursesToExcel(
                this.filterText,
                this.nameFilter,
                this.descriptionFilter,
                this.userNameFilter
            )
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    resetFilters(): void {
        this.filterText = '';
        this.nameFilter = '';
        this.descriptionFilter = '';
        this.maxProgressFilter = this.maxProgressFilterEmpty;
        this.minProgressFilter = this.maxProgressFilterEmpty;
        this.maxRatingFilter = this.maxRatingFilterEmpty;
        this.minRatingFilter = this.maxRatingFilterEmpty;
        this.maxScoreFilter = this.maxScoreFilterEmpty;
        this.minScoreFilter = this.maxScoreFilterEmpty;
        this.moodleCourseIdFilter = '';
        this.userNameFilter = '';

        this.getCourse();
    }


    selectCourseLessonActivity(activityId: string): void {

        // If the user is enrolled need to get the activity id details for this user
        // CourseLessonActivityId
        debugger;
        if (this.isEnrolled) {
            this._courseUsersServiceProxy.getCourseUserByActivityIdForEdit(activityId).subscribe((result) => {
                var courseLessonActivityId = result.courseUser.courseLessonActivityId;
                this.courseLessonActivitySelected.emit(courseLessonActivityId); 
            });
        }
        else {
            this.message.info(this.l('Enroll in this course to access this content'));
        }

    }

    getUserProfileID(): void {
        this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
            this.userProfileID = result;
        });
    }
    enrollCourseUser(event): void {
        let userProfileId = this._activatedRoute.snapshot.paramMap.get("profileid");

        if (!this.inputCourseId) {
            console.error('Course ID is undefined or null.');
            return;
        }
        if (!userProfileId) {
            userProfileId = this.userProfileID;

            this._userProfilesServiceProxy.getUserProfileIdForUser().subscribe((result) => {
                this.userProfileID = result;
                if (result) {
                    this._coursesServiceProxy
                        .enroleUser(this.inputCourseId, this.userProfileID)
                        .pipe(
                            finalize(() => {
                                console.log("Enrollment process completed.");
                            })
                        )
                        .subscribe(
                            () => {
                                this.isEnrolled = true;
                                this.notify.info(this.l('Enrolled Successfully'));
                            },
                            error => {
                                console.error('Error during enrollment:', error);
                            }
                        );
                }
            });
        }


    }
    parseVimeoDetails(json: string): VimeoDetailsDto {
        return JSON.parse(json);
    }
}
