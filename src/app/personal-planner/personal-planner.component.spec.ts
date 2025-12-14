import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlannerComponent } from './personal-planner.component';

describe('PersonalPlannerComponent', () => {
  let component: PersonalPlannerComponent;
  let fixture: ComponentFixture<PersonalPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
