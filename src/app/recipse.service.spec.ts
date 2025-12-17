import { TestBed } from '@angular/core/testing';

import { RecipseService } from './recipse.service';

describe('RecipseService', () => {
  let service: RecipseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
