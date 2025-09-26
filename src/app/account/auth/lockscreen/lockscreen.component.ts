import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})

/**
 * LookScreen Component
 */
export class LockscreenComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  unlockForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    /**
     * Form Validation
     */
    this.unlockForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.email]],
    });
    document.body.setAttribute('data-layout', 'vertical');
  }

  // convenience getter for easy access to form fields
  get f() { return this.unlockForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;
    // stop here if form is invalid
    if (this.unlockForm.invalid) {
      return;
    }
  }

}
