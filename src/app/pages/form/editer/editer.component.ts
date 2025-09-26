import { Component, OnInit } from '@angular/core';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-editer',
  templateUrl: './editer.component.html',
  styleUrls: ['./editer.component.scss']
})

/**
 * Editer Component
 */
export class EditerComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Form Editors', active: true }
    ];
  }

}
