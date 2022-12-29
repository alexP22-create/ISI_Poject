import { TestBed } from '@angular/core/testing';

import { ExpenseEntryGuard } from './expense-entry.guard';

describe('ExpenseEntryGuard', () => {
  let guard: ExpenseEntryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExpenseEntryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
