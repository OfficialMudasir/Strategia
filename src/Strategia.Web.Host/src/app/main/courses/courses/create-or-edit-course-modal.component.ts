import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CoursesServiceProxy, CreateOrEditCourseDto, ProfileServiceProxy, UpdateProfilePictureInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { CourseUserLookupTableModalComponent } from './course-user-lookup-table-modal.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { IAjaxResponse, TokenService } from 'abp-ng2-module';
import { AppConsts } from '../../../../shared/AppConsts';
import { AppSessionService } from '../../../../shared/common/session/app-session.service';

@Component({
  selector: 'createOrEditCourseModal',
  templateUrl: './create-or-edit-course-modal.component.html',
})
export class CreateOrEditCourseModalComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
  @ViewChild('courseUserLookupTableModal', { static: true })
  courseUserLookupTableModal: CourseUserLookupTableModalComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('uploadProfilePictureInputLabel') uploadProfilePictureInputLabel: ElementRef;

  active = false;
  saving = false;
  public skillsOverviewEditor = ClassicEditor;
  public skillsDescriptionEditor = ClassicEditor;
  skillsOverviewEditorDisplayData: any = ``;
  skillsDescriptionEditorDisplayData: any = ``;
  skillsOverviewEditorGetData:any=``;
  skillsDescriptionEditorGetData:any=``;

  editorConfig = {
    placeholder: 'Enter your skills overview here...',
  };
  editorConfig1 = {
    placeholder: 'Enter your skills description here...',
  };


  course: CreateOrEditCourseDto = new CreateOrEditCourseDto();

  userName = '';

  constructor(
    injector: Injector,
    private _coursesServiceProxy: CoursesServiceProxy,
      private _dateTimeService: DateTimeService,
      private _tokenService: TokenService,
      private _profileService: ProfileServiceProxy,
      private _appSessionService: AppSessionService

  ) {
    super(injector);
  }

  show(courseId?: string): void {
    if (!courseId) {
        this.course = new CreateOrEditCourseDto();
        this.course.id = courseId;
        this.course.authorProfilePictureId = this.guid();
        this.userName = '';
        this.skillsDescriptionEditorDisplayData='';
        this.skillsOverviewEditorDisplayData='';
        this.active = true;
        this.modal.show();
    } else {
        this._coursesServiceProxy.getCourseForEdit(courseId).subscribe((result) => {
        this.course = result.course;
        this.skillsDescriptionEditorDisplayData = this.course.skillsDescription;
        this.skillsOverviewEditorDisplayData = this.course.skillsOverview;
        this.userName = result.userName;
        this.active = true;

            if (!this.course.authorProfilePictureId || this.course.authorProfilePictureId === '00000000-0000-0000-0000-000000000000') {
                this.course.authorProfilePictureId = this.guid();
            }


        this.modal.show();
      });
    }
  }

  save(): void {
    this.saving = true;
    this.course.skillsDescription = this.skillsDescriptionEditorGetData ? this.skillsDescriptionEditorGetData : this.course.skillsDescription;
    this.course.skillsOverview = this.skillsOverviewEditorGetData ? this.skillsOverviewEditorGetData : this.course.skillsOverview;
    this._coursesServiceProxy
      .createOrEdit(this.course)
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


      this.uploader.uploadAll();

  }

  openSelectUserModal() {
    this.courseUserLookupTableModal.id = this.course.userId;
    this.courseUserLookupTableModal.displayName = this.userName;
    this.courseUserLookupTableModal.show();
  }

  setUserIdNull() {
    this.course.userId = null;
    this.userName = '';
  }

  getNewUserId() {
    this.course.userId = this.courseUserLookupTableModal.id;
    this.userName = this.courseUserLookupTableModal.displayName;
  }

  close(): void {
    this.active = false;
    this.imageChangedEvent='';
    this.modal.hide();
  }

  onChangeSkillOverview({ editor }) {
    this.skillsOverviewEditorGetData = editor.getData();
  }
  onChangeSkillDescription({ editor }) {
    this.skillsDescriptionEditorGetData = editor.getData();
  }

    ngOnInit(): void {

        this.active = true;
        this.temporaryPictureUrl = '';
        this.useGravatarProfilePicture = this.setting.getBoolean('App.UserManagement.UseGravatarProfilePicture');
        this.initFileUploader();
        this.uploader.clearQueue();
        this.userId = this._appSessionService.userId;
 
    }
 
    public uploader: FileUploader;
    public temporaryPictureUrl: string;
 
    public maxProfilPictureBytesUserFriendlyValue = 5;
    public useGravatarProfilePicture = false;

    imageChangedEvent: any = '';
    userId: number = null;

    private _uploaderOptions: FileUploaderOptions = {};

    imageCroppedFile(event: ImageCroppedEvent) {
        this.uploader.clearQueue();
        this.uploader.addToQueue([<File>base64ToFile(event.base64)]);
    }

    fileChangeEvent(event: any): void {
        if (event.target.files[0].size > 5242880) {
            //5MB
            this.message.warn(this.l('ProfilePicture_Warn_SizeLimit', this.maxProfilPictureBytesUserFriendlyValue));
            return;
        }

        this.uploadProfilePictureInputLabel.nativeElement.innerText = event.target.files[0].name;

        this.imageChangedEvent = event;

    }


    initFileUploader(): void {

        this.uploader = new FileUploader({ url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture' });
        this._uploaderOptions.autoUpload = true;
        this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        this._uploaderOptions.removeAfterUpload = true;
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        var token = this.course.authorProfilePictureId;
        this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
            form.append('FileType', fileItem.file.type);
            form.append('FileName', 'ProfilePicture');
            debugger;

            token = this.course.authorProfilePictureId;
            if (!this.course.authorProfilePictureId || this.course.authorProfilePictureId === '00000000-0000-0000-0000-000000000000') {
                debugger;
                token = this.guid();
            }

            form.append('FileToken', token);
        };

        this.uploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                this.updateProfilePicture(token);
            } else {
                this.message.error(resp.error.message);
            }
        };

        this.uploader.setOptions(this._uploaderOptions);
    }

    updateProfilePicture(fileToken: string): void {

        var token = this.course.authorProfilePictureId;

        if (!this.course.authorProfilePictureId || this.course.authorProfilePictureId === '00000000-0000-0000-0000-000000000000') {
            token = this.guid();
        }

        const input = new UpdateProfilePictureInput();
        input.fileToken = token;

        if (this.userId) {
            input.userId = this.userId;
        }

    }

    guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

}
