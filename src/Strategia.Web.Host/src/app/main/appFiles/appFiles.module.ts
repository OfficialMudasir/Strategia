import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
 
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
 
import { TextMaskModule } from 'angular2-text-mask';
 
import { AppFilesComponent } from './appFiles.component';

@NgModule({
    declarations: [
        AppFilesComponent
    ],
    imports: [AppSharedModule, AdminSharedModule, MultiSelectModule, ListboxModule, TextMaskModule],
    exports: [AppFilesComponent],
})
export class AppFilesModule {}
