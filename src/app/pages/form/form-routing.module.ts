import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicelementsComponent } from './basicelements/basicelements.component';
import { ValidationComponent } from './validation/validation.component';
import { AdvancedformComponent } from './advancedform/advancedform.component';
import { EditerComponent } from './editer/editer.component';
import { UploadsComponent } from './uploads/uploads.component';
import { WizardComponent } from './wizard/wizard.component';
import { MaskComponent } from './mask/mask.component';

const routes: Routes = [
  {
    path: 'elements',
    component: BasicelementsComponent
  },
  {
    path: 'validation',
    component: ValidationComponent
  },
  {
    path: 'advanced',
    component: AdvancedformComponent
  },
  {
    path: 'editor',
    component: EditerComponent
  },
  {
    path: 'uploads',
    component: UploadsComponent
  },
  {
    path: 'wizard',
    component: WizardComponent
  },
  {
    path: 'mask',
    component: MaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FormsRoutingModule { }
