import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';
import { NgbAccordion, NgbCollapse, NgbNav } from '@ng-bootstrap/ng-bootstrap';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsComponent],
      imports:[NgbNav,NgbCollapse,NgbAccordion]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
