import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentformListComponent } from './studentform-list.component';

describe('StudentformListComponent', () => {
  let component: StudentformListComponent;
  let fixture: ComponentFixture<StudentformListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentformListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentformListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
