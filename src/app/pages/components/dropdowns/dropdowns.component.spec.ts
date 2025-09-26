import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownsComponent } from './dropdowns.component';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

describe('DropdownsComponent', () => {
  let component: DropdownsComponent;
  let fixture: ComponentFixture<DropdownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownsComponent],
      imports:[NgbDropdown]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
