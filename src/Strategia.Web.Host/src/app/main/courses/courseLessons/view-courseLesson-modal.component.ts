import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetCourseLessonForViewDto, CourseLessonDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'viewCourseLessonModal',
  templateUrl: './view-courseLesson-modal.component.html',
})
export class ViewCourseLessonModalComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  item: GetCourseLessonForViewDto;

  constructor(injector: Injector) {
    super(injector);
    this.item = new GetCourseLessonForViewDto();
    this.item.courseLesson = new CourseLessonDto();
  }

  show(item: GetCourseLessonForViewDto): void {
    this.item = item;
    this.active = true;
    this.modal.show();
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
