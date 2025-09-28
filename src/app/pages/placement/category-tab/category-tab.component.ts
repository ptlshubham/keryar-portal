import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-category-tab',
  templateUrl: './category-tab.component.html',
  styleUrl: './category-tab.component.scss'
})
export class CategoryTabComponent implements OnInit {
  activeTab = 1;

  constructor(private router: Router) { }

  ngOnInit() {
    this.setActiveTab(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab(event.urlAfterRedirects);
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate(['/placement', route]);
  }

  setActiveTab(url: string) {
    if (url.includes('category') && !url.includes('sub-category')) {
      this.activeTab = 1;
    } else if (url.includes('sub-category')) {
      this.activeTab = 2;
    } else if (url.includes('sub-to-subcategory')) {
      this.activeTab = 3;
    }
  }
}
