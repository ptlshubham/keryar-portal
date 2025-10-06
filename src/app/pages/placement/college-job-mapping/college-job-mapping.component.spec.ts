import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeJobMappingComponent } from './college-job-mapping.component';

describe('CollegeJobMappingComponent', () => {
  let component: CollegeJobMappingComponent;
  let fixture: ComponentFixture<CollegeJobMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegeJobMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeJobMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
