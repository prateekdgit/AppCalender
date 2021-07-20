import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWorkspaceComponent } from './details-workspace.component';

describe('DetailsWorkspaceComponent', () => {
  let component: DetailsWorkspaceComponent;
  let fixture: ComponentFixture<DetailsWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
