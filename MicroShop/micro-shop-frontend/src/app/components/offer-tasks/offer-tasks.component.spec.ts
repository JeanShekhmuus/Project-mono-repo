import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTasksComponent } from './offer-tasks.component';

describe('OfferTasksComponent', () => {
  let component: OfferTasksComponent;
  let fixture: ComponentFixture<OfferTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
