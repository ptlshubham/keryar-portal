import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthenticationService } from '../../core/services/auth.service';
import { AuthCommonService } from '../../core/services/auth-common.service';
import { environment } from '../../../environments/environment';
import { LAYOUT_MODE } from '../../layouts/layouts.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  loginForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl!: string;
  layout_mode!: string;
  otpSent = false;
  isLoading = false;
  otpError = '';
  adminId: number | null = null;

  otpConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      'width': '40px',
      'height': '40px',
      'margin': '0 5px',
      'font-size': '18px',
      'border-radius': '4px',
      'border': '1px solid #ced4da',
      'text-align': 'center'
    }
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private authCommonService: AuthCommonService,
  ) {
    // redirect to home if already logged in
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.layout_mode = LAYOUT_MODE
    if (this.layout_mode === 'dark') {
      document.body.setAttribute("data-bs-theme", "dark");
    }
    //Validation Set
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    document.body.setAttribute('data-layout', 'vertical');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Send OTP to email
   */
  sendOtp() {
    if (this.loginForm.get('email')?.valid) {
      this.isLoading = true;
      this.otpError = '';

      this.authCommonService.sendOtp(this.f.email.value)
        .pipe(first())
        .subscribe({
          next: (response: any) => {
            if (response && response.success) {
              this.otpSent = true;
              this.isLoading = false;
              this.adminId = response.adminId;
              console.log('OTP sent successfully to:', this.f.email.value);
            } else {
              this.otpError = response.error || 'Failed to send OTP';
              this.isLoading = false;
            }
          },
          error: (error: HttpErrorResponse) => {
            const message = error.error?.error || error.message || 'Failed to send OTP';
            this.otpError = message;
            this.isLoading = false;
            console.error('Error sending OTP:', error);
          }
        });
    }
  }

  /**
   * Resend OTP
   */
  resendOtp() {
    this.otpError = '';
    this.loginForm.patchValue({ otp: '' });
    this.isLoading = true;

    this.authCommonService.sendOtp(this.f.email.value)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.isLoading = false;
            this.adminId = response.adminId;
            console.log('OTP resent successfully');
          } else {
            this.otpError = response.error || 'Failed to resend OTP';
            this.isLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          const message = error.error?.error || error.message || 'Failed to resend OTP';
          this.otpError = message;
          this.isLoading = false;
        }
      });
  }

  /**
   * OTP Change Handler
   */
  onOtpChange(otp: string) {
    this.loginForm.patchValue({ otp: otp });
    this.otpError = '';
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    if (!this.adminId) {
      this.otpError = 'Invalid session. Please resend OTP.';
      return;
    }

    this.isLoading = true;
    this.otpError = '';

    const email = this.f.email.value;
    const otp = this.f.otp.value;

    this.authCommonService.loginWithOtp(email, otp, this.adminId)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res && res.success && res.admin) {
            const user = res.admin;

            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify({
              id: user.id,
              username: user.name || user.email,
              email: user.email,
              firstName: user.name,
              lastName: '',
              role: user.role || 'admin'
            }));
            localStorage.setItem('token', user.token);
            localStorage.setItem('UserId', user.id);
            localStorage.setItem('Name', user.name || user.email);
            localStorage.setItem('Email', user.email);
            localStorage.setItem('Role', user.role || 'admin');
            localStorage.setItem('SessionId', user.sessionId);

            this.isLoading = false;
            console.log('Login successful');

            // Navigate to return URL or home
            this.router.navigate([this.returnUrl]);
          } else {
            this.isLoading = false;
            this.otpError = 'Login failed. Please try again.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          const message = error.error?.error || error.message || 'Login failed';

          if (error.status === 401 && message.includes('Invalid or expired OTP')) {
            this.otpError = 'Incorrect OTP! Please try again.';
          } else if (error.status === 401 && message.includes('Admin not found')) {
            this.otpError = 'Admin not found or inactive.';
          } else if (error.status === 404) {
            this.otpError = 'Email not found or admin is inactive.';
          } else {
            this.otpError = message;
          }

          console.error('Login error:', error);
        }
      });
  }

}
