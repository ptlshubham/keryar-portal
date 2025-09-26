import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightboxComponent } from './lightbox.component';
import { Lightbox, LightboxConfig, LightboxModule } from 'ngx-lightbox';

describe('LightboxComponent', () => {
  let component: LightboxComponent;
  let fixture: ComponentFixture<LightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightboxComponent],
      imports: [LightboxModule],
      providers: [
        LightboxConfig, // You might need to provide LightboxConfig here
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
