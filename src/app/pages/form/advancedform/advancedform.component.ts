import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-advancedform',
  templateUrl: './advancedform.component.html',
  styleUrls: ['./advancedform.component.scss']
})

/**
 * Advanced Form Component
 */
export class AdvancedformComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Component colorpicker
  componentcolor!: string;
  monolith!: string;
  nano!: string;
  rgbcolor!: string;
  color!: string;
  presetcolor!: string;
  inlinecolor!: string;
  hidden!: boolean;
  selected: any;
  hoveredDate: NgbDate | null = null;
  fromNGDate: NgbDate | null = null;
  toNGDate: NgbDate | null = null;
  @Input() fromDate: Date | null = null;
  @Input() toDate: Date | null = null;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  constructor(private calendar: NgbCalendar) { }

  /**
   * Default Select2
   */
  selectedAccount = 'Adam';
  Default = [
    { name: 'Adam' },
    { name: 'Homer' },
    { name: 'Samantha' },
    { name: 'Amalie' },
    { name: 'Estefanía' },
    { name: 'Adrian' },
    { name: 'Wladimir' },
    { name: 'Natasha' },
    { name: 'Nicole' },
    { name: 'Michael' },
    { name: 'Nicolás' }
  ];

  /**
   * Option groups Select2
   */
  selectedGroup = 'Adam';
  Groups = [
    { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States', child: { state: 'Active' } },
    { name: 'Homer', email: 'homer@email.com', age: 47, country: '', child: { state: 'Active' } },
    { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States', child: { state: 'Active' } },
    { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina', child: { state: 'Active' } },
    { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina', child: { state: 'Active' } },
    { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador', child: { state: 'Active' } },
    { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador', child: { state: 'Inactive' } },
    { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador', child: { state: 'Inactive' } },
    { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } },
    { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia', child: { state: 'Inactive' } },
    { name: 'Nicolás', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } }
  ];

  /**
   * Option Disabled groups Select2
   */
  selectedOption = 'Adam';
  Options = [
    { name: 'Adam' },
    { name: 'Homer', 'disabled': true },
    { name: 'Samantha' },
    { name: 'Amalie' },
    { name: 'Estefanía', 'disabled': true },
    { name: 'Adrian' },
    { name: 'Wladimir' },
    { name: 'Natasha' },
    { name: 'Nicole', 'disabled': true },
    { name: 'Michael' },
    { name: 'Nicolás' }];

  /**
   * Multiple Default Select2
   */
  multiDefaultOption = 'Adam';

  /**
   * Multiple Default Select2
   */
  selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];

  /**
   * Disabled Select2
   */
  disable = true;
  selectedPeople1 = [
    { name: 'Adam', disabled: true },
    { name: 'Homer' },
    { name: 'Samantha', disabled: true }
  ];

  basicDemoValue: any;
  minDateShow = new Date();
  multiDates: Date[] = [new Date(), (new Date() as any)['fp_incr'](10)];
  timePicker: Date | undefined;
  dateTimeValue: Date = new Date();
  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10)
  };
  inlineDatePicker: Date = new Date();

  ngOnInit(): void {

    this.basicDemoValue = '2017-01-01';
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Advanced Plugins', active: true }
    ];

    // Component color value of color picker
    this.componentcolor = 'rgba(74, 79, 234, 1)';

    // Monolith color value of color picker
    this.monolith = 'rgba(39, 187, 232, 1)';

    // Nano color value of color picker
    this.nano = 'rgba(247, 204, 83, 1)';

    this.selected = '';
    this.hidden = true;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

}
