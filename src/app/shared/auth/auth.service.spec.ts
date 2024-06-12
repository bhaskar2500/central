import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
/**
 * Test Scenarios:
 *   i. [Pending] checks for success login
 *  ii. [Pending] checks for fail login
 * iii. [Pending] checks for retreiving logged in user
 */
describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  // it('should be created', inject([AuthService], (service: AuthService) => {
  //   expect(service).toBeTruthy();
  // }));
});
