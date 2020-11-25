import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnalyticsDateRangeSelectComponent } from './analytics-date-range-select.component';

describe('AnalyticsDateRangeSelectComponent', () => {
  let component: AnalyticsDateRangeSelectComponent;
  let fixture: ComponentFixture<AnalyticsDateRangeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsDateRangeSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsDateRangeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
