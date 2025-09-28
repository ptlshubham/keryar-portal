import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubToSubCategoryComponent } from './sub-to-sub-category.component';

describe('SubToSubCategoryComponent', () => {
  let component: SubToSubCategoryComponent;
  let fixture: ComponentFixture<SubToSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubToSubCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubToSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
