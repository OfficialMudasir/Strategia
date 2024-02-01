import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import {
  CourseUsersServiceProxy,
  CreateOrEditCourseUserDto,
  CourseUserUserProfileLookupTableDto,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CourseUserCourseLookupTableModalComponent } from './courseUser-course-lookup-table-modal.component';
import { CourseUserCourseLessonLookupTableModalComponent } from './courseUser-courseLesson-lookup-table-modal.component';
import { CourseUserCourseLessonActivityLookupTableModalComponent } from './courseUser-courseLessonActivity-lookup-table-modal.component';

@Component({
  selector: 'createOrEditCourseUserModal',
  templateUrl: './create-or-edit-courseUser-modal.component.html',
})
export class CreateOrEditCourseUserModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('courseUserCourseLookupTableModal', { static: true })
  courseUserCourseLookupTableModal: CourseUserCourseLookupTableModalComponent;
  @ViewChild('courseUserCourseLessonLookupTableModal', { static: true })
  courseUserCourseLessonLookupTableModal: CourseUserCourseLessonLookupTableModalComponent;
  @ViewChild('courseUserCourseLessonActivityLookupTableModal', { static: true })
  courseUserCourseLessonActivityLookupTableModal: CourseUserCourseLessonActivityLookupTableModalComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  courseUser: CreateOrEditCourseUserDto = new CreateOrEditCourseUserDto();

  courseName = '';
  courseLessonName = '';
  courseLessonActivityName = '';
  userProfileProfileName = '';

  allUserProfiles: CourseUserUserProfileLookupTableDto[];

  constructor(
    injector: Injector,
    private _courseUsersServiceProxy: CourseUsersServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  show(courseUserId?: string): void {
    if (!courseUserId) {
      this.courseUser = new CreateOrEditCourseUserDto();
      this.courseUser.id = courseUserId;
      this.courseName = '';
      this.courseLessonName = '';
      this.courseLessonActivityName = '';
      this.userProfileProfileName = '';

      this.active = true;
      this.modal.show();
    } else {
      this._courseUsersServiceProxy.getCourseUserForEdit(courseUserId).subscribe((result) => {
        this.courseUser = result.courseUser;

        this.courseName = result.courseName;
        this.courseLessonName = result.courseLessonName;
        this.courseLessonActivityName = result.courseLessonActivityName;
        this.userProfileProfileName = result.userProfileProfileName;

        this.active = true;
        this.modal.show();
      });
    }
    this._courseUsersServiceProxy.getAllUserProfileForTableDropdown().subscribe((result) => {
      this.allUserProfiles = result;
    });
  }

  save(): void {
    this.saving = true;

    this._courseUsersServiceProxy
      .createOrEdit(this.courseUser)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.modalSave.emit(null);
      });
  }

  openSelectCourseModal() {
    this.courseUserCourseLookupTableModal.id = this.courseUser.courseId;
    this.courseUserCourseLookupTableModal.displayName = this.courseName;
    this.courseUserCourseLookupTableModal.show();
  }
  openSelectCourseLessonModal() {
    this.courseUserCourseLessonLookupTableModal.id = this.courseUser.courseLessonId;
    this.courseUserCourseLessonLookupTableModal.displayName = this.courseLessonName;
    this.courseUserCourseLessonLookupTableModal.show();
  }
  openSelectCourseLessonActivityModal() {
    this.courseUserCourseLessonActivityLookupTableModal.id = this.courseUser.courseLessonActivityId;
    this.courseUserCourseLessonActivityLookupTableModal.displayName = this.courseLessonActivityName;
    this.courseUserCourseLessonActivityLookupTableModal.show();
  }

  setCourseIdNull() {
    this.courseUser.courseId = null;
    this.courseName = '';
  }
  setCourseLessonIdNull() {
    this.courseUser.courseLessonId = null;
    this.courseLessonName = '';
  }
  setCourseLessonActivityIdNull() {
    this.courseUser.courseLessonActivityId = null;
    this.courseLessonActivityName = '';
  }

  getNewCourseId() {
    this.courseUser.courseId = this.courseUserCourseLookupTableModal.id;
    this.courseName = this.courseUserCourseLookupTableModal.displayName;
  }
  getNewCourseLessonId() {
    this.courseUser.courseLessonId = this.courseUserCourseLessonLookupTableModal.id;
    this.courseLessonName = this.courseUserCourseLessonLookupTableModal.displayName;
  }
  getNewCourseLessonActivityId() {
    this.courseUser.courseLessonActivityId = this.courseUserCourseLessonActivityLookupTableModal.id;
    this.courseLessonActivityName = this.courseUserCourseLessonActivityLookupTableModal.displayName;
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  ngOnInit(): void {}
}
