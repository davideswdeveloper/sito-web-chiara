import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicettarioComponent } from './ricettario.component';

describe('RicettarioComponent', () => {
  let component: RicettarioComponent;
  let fixture: ComponentFixture<RicettarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RicettarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RicettarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
