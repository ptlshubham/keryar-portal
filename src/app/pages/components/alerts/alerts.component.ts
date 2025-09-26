import { Component, OnInit, ViewChild } from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

import { alertData } from './data';
import { AlertColor } from './alerts.model';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

/**
 * Alerts Component
 */
export class AlertsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  alertData: AlertColor[] = [];
  // Alert
  private _success = new Subject<string>();
  successMessage = '';
  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert!: NgbAlert;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Alerts', active: true }
    ];

    /***
     * Data Get 
    */
    this._fetchData();

    // Alert Message Append
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  /***
   * Notification Data Get
   */
  private _fetchData() {
    this.alertData = alertData;
  }

  /***
   * Notification remove
   */
  close(alert: AlertColor, alertData: AlertColor[]) {
    alertData.splice(alertData.indexOf(alert), 1);
  }

  /**
   * Alert Model Msg Get
   */
   public changeSuccessMessage() { this._success.next(`Nice, you triggered this alert message!`); }

}
