import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    CourseLessonActivitiesServiceProxy,
    CourseLessonActivityDto,
    CourseUsersServiceProxy,
    GetCourseUserForEditOutput,
} from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';

import Player from '@vimeo/player';
import { VimeoDetailsDto } from '../courses/course.vimeo';

@Component({
    selector: 'viewCourseLessonActivity',
    templateUrl: './view-lesson-activity.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class ViewLessonActivityComponent extends AppComponentBase implements OnInit {
    // @ViewChild('createOrEditCourseModal', { static: true }) createOrEditCourseModal: CreateOrEditCourseModalComponent;
    // @ViewChild('viewCourseModal', { static: true }) viewCourseModal: ViewCourseModalComponent;

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('videoElement') videoElement: ElementRef;

    @Input() inputCourseLessonActivityId: string = '';

    saving = false;

    options: any;
    vimeoPlayer: any;
    isVimeoError = false;

    advancedFiltersAreShown = false;
    videoDuration: number;
    vimeoVideoDuration: string;
    titleVideo: any;
    timeWatching: number;
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
    watchVimeoTimeInterval: any;
    watchTimeUpdateInterval: any;

    activity: CourseLessonActivityDto = new CourseLessonActivityDto();
    courseUser: GetCourseUserForEditOutput = new GetCourseUserForEditOutput();
    vimeoVideoActivity: VimeoDetailsDto = new VimeoDetailsDto();

    constructor(
        injector: Injector,
        private _courseLessonActivitiesServiceProxy: CourseLessonActivitiesServiceProxy,
        private _courseUsersServiceProxy: CourseUsersServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _dateTimeService: DateTimeService,
        private sanitizer: DomSanitizer,
        private el: ElementRef,
        private http: HttpClient,

    ) {
        super(injector);
        this.initializeBeforeUnloadEvent();
    }

    ngOnInit(): void {
        let activityId = this._activatedRoute.snapshot.paramMap.get('courseLessonActivityId');
        if (!activityId) {
            activityId = this.inputCourseLessonActivityId;
        }
        this.getLessonActivity(activityId);
        this.getCourseUser(activityId);
    }
    ngAfterViewInit() {
    }

    getSafeUrl(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    getCourseUser(activityId?: string): void {
        this._courseUsersServiceProxy.getCourseUserByActivityIdForEdit(activityId).subscribe((result) => {
            this.courseUser = result;
            //this.initVideo();
        });
    }

    getLessonActivity(activityId?: string): void {
        this._courseLessonActivitiesServiceProxy.getCourseLessonActivityForView(activityId).subscribe((result) => {
            this.activity = result.courseLessonActivity;
            this.titleVideo = this.getSafeUrl(this.activity.titleVideo);
            if (this.activity) {
                this.vimeoImport(result);
            }
        });
    }

    CreateOrEditApiCall(courseUser?: any): void {
        this._courseUsersServiceProxy
            .createOrEdit(courseUser)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
            });
    }

    vimeoImport(result): void {

        this.options = {
            id: this.activity.titleVideo,
            responsive: true,
            loop: false
        };

        if (result.activityVideoDetails && !result.activityVideoDetails.includes("Not Found")) {
            try {

                this.vimeoVideoActivity = this.parseVimeoDetails(result.activityVideoDetails);
                this.vimeoVideoDuration = this.vimeoVideoActivity[0].duration;

                //Build Vimeo Player
                let VideoPlayer = document.querySelector(".VideoPlayer");
                let vimeoVideoPlayerdiv = document.createElement("div");
                vimeoVideoPlayerdiv.setAttribute("id", "vimeo-video");
                vimeoVideoPlayerdiv.setAttribute("class", "vimeo");
                VideoPlayer.append(vimeoVideoPlayerdiv);
                let intervalId; 
                this.vimeoPlayer = new Player('vimeo-video', this.options);

                this.vimeoPlayer.on('play', (res) => {
 
                    intervalId = setInterval(() => {
                        this.courseUser.courseUser.courseLessonActivityCompletedTotal = this.watchVimeoTimeInterval.toString();
                        this.CreateOrEditApiCall(this.courseUser.courseUser);
                    }, 10000);
                });

                this.vimeoPlayer.on('timeupdate', (data) => {
                    this.watchVimeoTimeInterval = data.seconds;
                    console.log('this.watchVimeoTimeInterval : ', this.watchVimeoTimeInterval);
                });

                this.vimeoPlayer.on('pause', res => {
                    clearInterval(intervalId);
                    this.activity.id = this._activatedRoute.snapshot.paramMap.get('courseLessonActivityId');
                    if (!this.activity.id) {
                        this.activity.id = this.inputCourseLessonActivityId;
                    }

                    this.activity.watchTime = res.seconds.toString();
                    this.courseUser.courseUser.courseLessonActivityCompletedTotal = res.seconds.toString();
                    this._courseUsersServiceProxy
                        .createOrEdit(this.courseUser.courseUser)
                        .pipe(
                            finalize(() => {
                                this.saving = false;
                            })
                        )
                        .subscribe(() => {

                        });
                });

                this.vimeoPlayer.on('ended', () => {
                    clearInterval(intervalId);
                    this.courseUser.courseUser.courseLessonActivityCompletedTotal = this.watchVimeoTimeInterval.toString();
                        this.CreateOrEditApiCall(this.courseUser.courseUser);
                });

                let lastKnownTime = this.courseUser.courseUser.courseLessonActivityCompletedTotal;
                const threshold = 1; // seconds allowed to seek forward

                this.vimeoPlayer.on('timeupdate', (data) => {
                    if (data.seconds > lastKnownTime + threshold) {
                        this.vimeoPlayer.setCurrentTime(lastKnownTime).catch(error => console.error(error));
                    } else {
                        lastKnownTime = data.seconds;
                    }
                });

                //set default start time of vimeo video player           
                if (this.courseUser.courseUser.courseLessonActivityCompletedTotal > 0) {
                    this.vimeoPlayer.setCurrentTime(this.courseUser.courseUser.courseLessonActivityCompletedTotal).then(function (seconds) {
                        // seconds = the actual time that the player seeked to
                    }).catch(function (error) {
                        switch (error.name) {
                            case 'RangeError':
                                // the time was less than 0 or greater than the video’s duration
                                break;
                            default:
                                break;
                        }
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        else {
            this.isVimeoError = true;
        }
    }
    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
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

        this.getLessonActivity();
    }

    private initializeBeforeUnloadEvent() {
 
    }

    parseVimeoDetails(json: string): VimeoDetailsDto {
        return JSON.parse(json);
    }
}
