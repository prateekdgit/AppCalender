import { TestBed } from '@angular/core/testing';

import { HaveWorkspaceGuard } from './have-workspace.guard';

describe('HaveWorkspaceGuard', () => {
  let guard: HaveWorkspaceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HaveWorkspaceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
