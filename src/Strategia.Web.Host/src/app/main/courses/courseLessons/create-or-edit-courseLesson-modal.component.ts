import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CourseLessonsServiceProxy, CreateOrEditCourseLessonDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CourseLessonCourseLookupTableModalComponent } from './courseLesson-course-lookup-table-modal.component';

@Component({
  selector: 'createOrEditCourseLessonModal',
  templateUrl: './create-or-edit-courseLesson-modal.component.html',
})
export class CreateOrEditCourseLessonModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('courseLessonCourseLookupTableModal', { static: true })
  courseLessonCourseLookupTableModal: CourseLessonCourseLookupTableModalComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  courseLesson: CreateOrEditCourseLessonDto = new CreateOrEditCourseLessonDto();

  courseDisplayProperty = '';

  constructor(
    injector: Injector,
    private _courseLessonsServiceProxy: CourseLessonsServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  show(courseLessonId?: string): void {
    if (!courseLessonId) {
      this.courseLesson = new CreateOrEditCourseLessonDto();
      this.courseLesson.id = courseLessonId;
      this.courseDisplayProperty = '';

      this.active = true;
      this.modal.show();
    } else {
      this._courseLessonsServiceProxy.getCourseLessonForEdit(courseLessonId).subscribe((result) => {
        this.courseLesson = result.courseLesson;

        this.courseDisplayProperty = result.courseDisplayProperty;

        this.active = true;
        this.modal.show();
      });
    }
  }

  save(): void {
    this.saving = true;

    this._courseLessonsServiceProxy
      .createOrEdit(this.courseLesson)
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
    this.courseLessonCourseLookupTableModal.id = this.courseLesson.courseId;
    this.courseLessonCourseLookupTableModal.displayName = this.courseDisplayProperty;
    this.courseLessonCourseLookupTableModal.show();
  }

  setCourseIdNull() {
    this.courseLesson.courseId = null;
    this.courseDisplayProperty = '';
  }

  getNewCourseId() {
    this.courseLesson.courseId = this.courseLessonCourseLookupTableModal.id;
    this.courseDisplayProperty = this.courseLessonCourseLookupTableModal.displayName;
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  ngOnInit(): void {}
}
