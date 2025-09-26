import { Component, OnInit, TemplateRef } from '@angular/core';

import { ToastService } from './toast-service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})

/**
 * Notifications Component
 */
export class NotificationsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  show = true;
  translucent = true;
  stacking = true;
  stackingsecond = true;
  placement = true;

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Extended' },
      { label: 'Notifications', active: true }
    ];
  }

  /**
   * Standard message 
   */
  showStandard() {
    this.toastService.show('Normal Message', { classname: 'bg-primary text-center text-white', delay: 10000 });
  }

  /**
   * Success message 
   */
  showSuccess() {
    this.toastService.show('Success Message', { classname: 'bg-success text-center text-white', delay: 10000 });
  }

  /**
   * Danger message 
   */
  showDanger() {
    this.toastService.show('Error Message', { classname: 'bg-danger text-center text-white', delay: 10000 });
  }

  /**
   * Warning message 
   */
  showWarning() {
    this.toastService.show('Warning Message', { classname: 'bg-warning text-center text-white', delay: 10000 });
  }
}
