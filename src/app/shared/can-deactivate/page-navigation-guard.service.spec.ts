import { TestBed, inject } from '@angular/core/testing';

import { PageNavigationGuardService } from './page-navigation-guard.service';

describe('PageNavigationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageNavigationGuardService]
    });
  });

  it('should be created', inject([PageNavigationGuardService], (service: PageNavigationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
