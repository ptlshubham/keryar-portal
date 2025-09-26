import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, AbstractControl, UntypedFormArray, UntypedFormControl, ValidatorFn } from '@angular/forms';

import { MustMatch } from './validation.mustmatch';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})

/**
 * Validation Component
 */
export class ValidationComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Form submition
  submit!: boolean;
  formsubmit!: boolean;
  typesubmit!: boolean;
  specificsubmit!: boolean;
  submitted = false;
  rangesubmit!: boolean;

  //  Validation form
  validationform!: UntypedFormGroup;
  tooltipvalidationform!: UntypedFormGroup;
  validationForm!: UntypedFormGroup;
  specificValidationForm!: UntypedFormGroup;
  rangeValidationForm!: any;

  CountryData: Array<any> = [
    { name: 'Pear', value: 'pear' },
    { name: 'Plum', value: 'plum' },
    { name: 'Kiwi', value: 'kiwi' },
    { name: 'Apple', value: 'apple' },
    { name: 'Lime', value: 'lime' }
  ];

  constructor(public formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Form Validation', active: true }
    ];

    /**
     * Bootstrap validation form data
     */
    this.validationform = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      zip: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    });

    /**
     * Bootstrap tooltip validation form data
     */
    this.tooltipvalidationform = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      city: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      state: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    });

    /**
     * Form Validatyion
     */
    this.validationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [10, [Validators.required, Validators.min(14)]],
      password: ['', Validators.required],confirmpwd: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmpwd'),
      
    });

    /**
     * Specific Validation Form
     */
    this.specificValidationForm = this.formBuilder.group({
      capitalized: ['', [Validators.required, Validators.pattern('([A-Z]).{8,}')]]
    });

    /**
     * Range validation form
     */
    this.rangeValidationForm = this.formBuilder.group({
      required: ['', [Validators.required]],
      minlength: ['', [Validators.required, Validators.minLength(5)]],
      minvalue: ['', [Validators.required, Validators.min(100)]],
      select: ['', [Validators.required]],
      rangevalue: ['', [Validators.required, Validators.min(6), Validators.max(100)]],
      regularexp: ['', [Validators.required, Validators.pattern('#[A-Fa-f0-9]{6}')]],
    });
    this.submit = false;
    this.formsubmit = false;
    this.typesubmit = false;
    this.rangesubmit = false;
  }

  onCheckboxChange(e: any) {
    const checkArray: UntypedFormArray = this.rangeValidationForm.get('checkArray') as UntypedFormArray;

    if (e.target.checked) {
      checkArray.push(new UntypedFormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    this.submit = true;
  }

  /**
   * Returns form
   */
  get form() {
    return this.validationform.controls;
  }

  /**
   * Bootstrap tooltip form validation submit method
   */
  formSubmit() {
    this.formsubmit = true;
  }

  /**
   * returns tooltip validation form
   */
  get formData() {
    return this.tooltipvalidationform.controls;
  }

  // convenience getter for easy access to form fields
  get f() { return this.validationForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.validationForm.invalid) {
      return;
    }
  }

  /**
   * Type validation form submit data
   */
  typeSubmit() {
    this.typesubmit = true;
  }

  /**
   * Type validation form submit data
   */
  specificSubmit() {
    this.specificsubmit = true;
  }

  /**
   * Returns the type validation form
   */
  get specific() {
    return this.specificValidationForm.controls;
  }

  /**
   * Returns the range validation form
   */
  get range() {
    return this.rangeValidationForm.controls;
  }

  /**
   * range validation submit data
   */
  rangeSubmit() {
    this.rangesubmit = true;
  }

}
