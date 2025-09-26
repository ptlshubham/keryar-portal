import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { FlatpickrModule } from 'angularx-flatpickr';

import { SharedModule } from '../../shared/shared.module';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { FormsRoutingModule } from './form-routing.module';
import { BasicelementsComponent } from './basicelements/basicelements.component';
import { ValidationComponent } from './validation/validation.component';
import { AdvancedformComponent } from './advancedform/advancedform.component';
import { EditerComponent } from './editer/editer.component';
import { UploadsComponent } from './uploads/uploads.component';
import { WizardComponent } from './wizard/wizard.component';
import { MaskComponent } from './mask/mask.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    BasicelementsComponent,
    ValidationComponent,
    AdvancedformComponent,
    EditerComponent,
    UploadsComponent,
    WizardComponent,
    MaskComponent
  ],
  imports: [
    CommonModule,
    CdkStepperModule,
    NgStepperModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgSelectModule,
    ColorPickerModule,
    NgbDatepickerModule,
    CKEditorModule,
    NgbProgressbarModule,
    DropzoneModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule,
    FormsRoutingModule,
    FlatpickrModule.forRoot()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    provideNgxMask(),
  ]
})
export class FormModule { }
