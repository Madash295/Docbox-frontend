import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleRightModalComponent } from './role-right-modal.component';

describe('RoleRightModalComponent', () => {
  let component: RoleRightModalComponent;
  let fixture: ComponentFixture<RoleRightModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleRightModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleRightModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
