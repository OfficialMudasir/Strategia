import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetUserProfileForViewDto, UserProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'viewUserProfileModal',
  templateUrl: './view-userProfile-modal.component.html',
})
export class ViewUserProfileModalComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  item: GetUserProfileForViewDto;

  constructor(injector: Injector) {
    super(injector);
    this.item = new GetUserProfileForViewDto();
    this.item.userProfile = new UserProfileDto();
  }

  show(item: GetUserProfileForViewDto): void {
    this.item = item;
    this.active = true;
    this.modal.show();
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
