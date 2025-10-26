import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedCareerPersonComponent } from './approved-career-person.component';

describe('ApprovedCareerPersonComponent', () => {
  let component: ApprovedCareerPersonComponent;
  let fixture: ComponentFixture<ApprovedCareerPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedCareerPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedCareerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
