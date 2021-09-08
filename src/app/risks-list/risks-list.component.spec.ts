import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisksListComponent } from './risks-list.component';

describe('RisksListComponent', () => {
  let component: RisksListComponent;
  let fixture: ComponentFixture<RisksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisksListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RisksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
