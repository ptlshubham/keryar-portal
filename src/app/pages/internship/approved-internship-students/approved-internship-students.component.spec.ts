import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedInternshipStudentsComponent } from './approved-internship-students.component';

describe('ApprovedInternshipStudentsComponent', () => {
  let component: ApprovedInternshipStudentsComponent;
  let fixture: ComponentFixture<ApprovedInternshipStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedInternshipStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedInternshipStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
