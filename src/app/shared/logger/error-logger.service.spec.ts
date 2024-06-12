import { TestBed, inject } from '@angular/core/testing';

import { ErrorLoggerService } from './error-logger.service';

describe('ErrorLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorLoggerService]
    });
  });

  it('should be created', inject([ErrorLoggerService], (service: ErrorLoggerService) => {
    expect(service).toBeTruthy();
  }));
});
