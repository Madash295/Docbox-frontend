import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleRightComponent } from './role-right.component';

describe('RoleRightComponent', () => {
  let component: RoleRightComponent;
  let fixture: ComponentFixture<RoleRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
