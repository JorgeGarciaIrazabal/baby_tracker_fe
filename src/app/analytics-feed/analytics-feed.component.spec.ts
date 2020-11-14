import { async, ComponentFixture, TestBed } from "@angular/core/testing"
import { IonicModule } from "@ionic/angular"

import { AnalyticsFeedComponent } from "./analytics-feed.component"

describe("AnalyticsFeedComponent", () => {
  let component: AnalyticsFeedComponent
  let fixture: ComponentFixture<AnalyticsFeedComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsFeedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(AnalyticsFeedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
