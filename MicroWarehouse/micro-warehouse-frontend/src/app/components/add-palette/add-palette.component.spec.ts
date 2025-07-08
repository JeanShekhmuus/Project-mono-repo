import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaletteComponent } from './add-palette.component';

describe('AddPaletteComponent', () => {
  let component: AddPaletteComponent;
  let fixture: ComponentFixture<AddPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
