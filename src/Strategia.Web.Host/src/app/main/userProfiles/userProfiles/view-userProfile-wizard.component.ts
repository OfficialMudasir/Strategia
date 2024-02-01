import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CreateOrEditUserProfileDto, GetUserProfileForEditOutput, GetUserProfileForViewDto, UserProfileDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewUserProfileWizard',
    templateUrl: './view-userProfile-wizard.component.html',
})
export class ViewUserProfileWizardComponent extends AppComponentBase {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetUserProfileForEditOutput;

    constructor(injector: Injector) {
        super(injector);
        debugger;
        this.item = new GetUserProfileForEditOutput();
        this.item.userProfile = new CreateOrEditUserProfileDto();
    }

    show(item: GetUserProfileForEditOutput): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
