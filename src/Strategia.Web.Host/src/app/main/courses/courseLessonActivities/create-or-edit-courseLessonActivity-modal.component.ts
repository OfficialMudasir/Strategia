import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import {
  CourseLessonActivitiesServiceProxy,
  CreateOrEditCourseLessonActivityDto,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CourseLessonActivityCourseLessonLookupTableModalComponent } from './courseLessonActivity-courseLesson-lookup-table-modal.component';

@Component({
  selector: 'createOrEditCourseLessonActivityModal',
  templateUrl: './create-or-edit-courseLessonActivity-modal.component.html',
})
export class CreateOrEditCourseLessonActivityModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('courseLessonActivityCourseLessonLookupTableModal', { static: true })
  courseLessonActivityCourseLessonLookupTableModal: CourseLessonActivityCourseLessonLookupTableModalComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  courseLessonActivity: CreateOrEditCourseLessonActivityDto = new CreateOrEditCourseLessonActivityDto();

  courseLessonDisplayProperty = '';

  constructor(
    injector: Injector,
    private _courseLessonActivitiesServiceProxy: CourseLessonActivitiesServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  show(courseLessonActivityId?: string): void {
    if (!courseLessonActivityId) {
      this.courseLessonActivity = new CreateOrEditCourseLessonActivityDto();
      this.courseLessonActivity.id = courseLessonActivityId;
      this.courseLessonDisplayProperty = '';

      this.active = true;
      this.modal.show();
    } else {
      this._courseLessonActivitiesServiceProxy
        .getCourseLessonActivityForEdit(courseLessonActivityId)
        .subscribe((result) => {
          this.courseLessonActivity = result.courseLessonActivity;

          this.courseLessonDisplayProperty = result.courseLessonDisplayProperty;

          this.active = true;
          this.modal.show();
        });
    }
  }

  save(): void {
    this.saving = true;

    this._courseLessonActivitiesServiceProxy
      .createOrEdit(this.courseLessonActivity)
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

  openSelectCourseLessonModal() {
    this.courseLessonActivityCourseLessonLookupTableModal.id = this.courseLessonActivity.courseLessonId;
    this.courseLessonActivityCourseLessonLookupTableModal.displayName = this.courseLessonDisplayProperty;
    this.courseLessonActivityCourseLessonLookupTableModal.show();
  }

  setCourseLessonIdNull() {
    this.courseLessonActivity.courseLessonId = null;
    this.courseLessonDisplayProperty = '';
  }

  getNewCourseLessonId() {
    this.courseLessonActivity.courseLessonId = this.courseLessonActivityCourseLessonLookupTableModal.id;
    this.courseLessonDisplayProperty = this.courseLessonActivityCourseLessonLookupTableModal.displayName;
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }

  ngOnInit(): void {}
}
