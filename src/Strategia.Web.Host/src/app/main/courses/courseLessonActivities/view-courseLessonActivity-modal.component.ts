import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
  GetCourseLessonActivityForViewDto,
  CourseLessonActivityDto,
  ActivityType,
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'viewCourseLessonActivityModal',
  templateUrl: './view-courseLessonActivity-modal.component.html',
})
export class ViewCourseLessonActivityModalComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  item: GetCourseLessonActivityForViewDto;
  activityType = ActivityType;

  constructor(injector: Injector) {
    super(injector);
    this.item = new GetCourseLessonActivityForViewDto();
    this.item.courseLessonActivity = new CourseLessonActivityDto();
  }

  show(item: GetCourseLessonActivityForViewDto): void {
    this.item = item;
    this.active = true;
    this.modal.show();
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
