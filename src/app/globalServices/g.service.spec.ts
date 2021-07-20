import { TestBed } from '@angular/core/testing';

import { GserviceService } from './gservice.service';

describe('GserviceService', () => {
  let service: GserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
