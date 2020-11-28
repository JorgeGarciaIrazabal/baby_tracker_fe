import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AnalyticsGrowthComponent} from './analytics-growth.component';

describe('AnalyticsGrowthComponent', () => {
  let component: AnalyticsGrowthComponent;
  let fixture: ComponentFixture<AnalyticsGrowthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsGrowthComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
