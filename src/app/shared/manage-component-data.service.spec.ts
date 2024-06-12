import { TestBed, inject } from '@angular/core/testing';

import { ManageComponentDataService } from './manage-component-data.service';

describe('ManageComponentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageComponentDataService]
    });
  });

  it('should be created', inject([ManageComponentDataService], (service: ManageComponentDataService) => {
    expect(service).toBeTruthy();
  }));
});
