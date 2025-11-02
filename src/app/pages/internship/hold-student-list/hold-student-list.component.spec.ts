import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldStudentListComponent } from './hold-student-list.component';

describe('HoldStudentListComponent', () => {
  let component: HoldStudentListComponent;
  let fixture: ComponentFixture<HoldStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoldStudentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
