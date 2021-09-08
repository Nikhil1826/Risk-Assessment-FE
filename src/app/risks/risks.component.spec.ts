import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisksComponent } from './risks.component';

describe('RisksComponent', () => {
  let component: RisksComponent;
  let fixture: ComponentFixture<RisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
