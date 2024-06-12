import { TestBed, inject } from '@angular/core/testing';

import { UserApiInfoMockService } from './user-api-info-mock.service';

describe('UserApiInfoMockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserApiInfoMockService]
    });
  });

  it('should be created', inject([UserApiInfoMockService], (service: UserApiInfoMockService) => {
    expect(service).toBeTruthy();
  }));
});
