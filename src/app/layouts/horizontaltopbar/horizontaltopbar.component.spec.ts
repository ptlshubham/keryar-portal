import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontaltopbarComponent } from './horizontaltopbar.component';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HorizontaltopbarComponent', () => {
  let component: HorizontaltopbarComponent;
  let fixture: ComponentFixture<HorizontaltopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HorizontaltopbarComponent],
    imports: [],
    providers: [TranslateService, TranslateStore, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontaltopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
