import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})

/**
 * Carousel Component
 */
export class CarouselComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Carousel navigation arrow show
  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Components' },
      { label: 'Carousel', active: true }
    ];
  }

}
