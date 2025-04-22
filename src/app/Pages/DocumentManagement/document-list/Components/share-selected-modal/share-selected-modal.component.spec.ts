import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSelectedModalComponent } from './share-selected-modal.component';

describe('ShareSelectedModalComponent', () => {
  let component: ShareSelectedModalComponent;
  let fixture: ComponentFixture<ShareSelectedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareSelectedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareSelectedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
