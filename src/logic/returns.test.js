/**
 * returns.test.js
 * Tests for the Returns & Refunds business logic.
 *
 * Run with:  npx vitest run
 *
 * Responsibility: Person 3 — Data & Logic Engineer B (Returns & Refunds)
 */

import { describe, it, expect } from 'vitest';
import { checkReturnEligibility } from './returns.js';

describe('checkReturnEligibility', () => {
  /**
   * Test 1 — Eligible for return
   * ORD001: Delivered 2026-07-20, no prior return. Should be eligible
   * (within 30-day window as of Aug 15 2026 = 26 days elapsed).
   */
  it('Test 1 — returns eligible result for a delivered order within the return window', () => {
    const result = checkReturnEligibility('ORD001');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(true);
    expect(result.returnStatus).toBe('Not Requested');
    expect(result.refundStatus).toBe('Not Requested');
    expect(result.message).toMatch(/eligible for return/i);
  });

  /**
   * Test 2 — Return window expired
   * ORD002: Delivered 2026-06-01, which is more than 30 days ago.
   */
  it('Test 2 — returns not eligible when the 30-day return window has expired', () => {
    const result = checkReturnEligibility('ORD002');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.message).toMatch(/return window has expired/i);
  });

  /**
   * Test 3 — Already returned
   * ORD003: returnStatus = "Returned", refundStatus = "Refund Completed".
   */
  it('Test 3 — returns not eligible when the order has already been returned', () => {
    const result = checkReturnEligibility('ORD003');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.returnStatus).toBe('Returned');
  });

  /**
   * Test 4 — Already refunded
   * ORD004: refundStatus = "Refund Completed".
   */
  it('Test 4 — shows Refund Completed when the order has already been refunded', () => {
    const result = checkReturnEligibility('ORD004');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.refundStatus).toBe('Refund Completed');
    expect(result.message).toMatch(/already been returned and refunded/i);
  });

  /**
   * Test 5 — Order not found
   * ORD999 does not exist in orders.json.
   */
  it('Test 5 — returns Order Not Found for an unknown order ID', () => {
    const result = checkReturnEligibility('ORD999');
    expect(result.found).toBe(false);
    expect(result.eligible).toBe(false);
    expect(result.returnStatus).toBeNull();
    expect(result.refundStatus).toBeNull();
    expect(result.message).toMatch(/order not found/i);
  });

  /**
   * Test 6 — Not yet delivered
   * ORD005: orderStatus = "Processing", deliveryDate = null.
   */
  it('Test 6 — returns not eligible when the order has not been delivered yet', () => {
    const result = checkReturnEligibility('ORD005');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.message).toMatch(/not been delivered/i);
  });

  /**
   * Test 7 — Refund pending
   * ORD006: returnStatus = "Return Requested", refundStatus = "Refund Pending".
   */
  it('Test 7 — shows Refund Pending when a return is requested but refund not yet processed', () => {
    const result = checkReturnEligibility('ORD006');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.refundStatus).toBe('Refund Pending');
    expect(result.message).toMatch(/refund is currently pending/i);
  });

  /**
   * Test 8 — Return approved, awaiting item
   * ORD007: returnStatus = "Return Approved", refundStatus = "Not Requested".
   */
  it('Test 8 — shows Return Approved — Awaiting Item when approved but item not shipped back', () => {
    const result = checkReturnEligibility('ORD007');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(false);
    expect(result.returnStatus).toBe('Return Approved');
    expect(result.message).toMatch(/awaiting item/i);
  });

  /**
   * Bonus — Case-insensitive lookup
   * Entering "ord001" should resolve the same as "ORD001".
   */
  it('Bonus — handles case-insensitive order ID lookup', () => {
    const result = checkReturnEligibility('ord001');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(true);
  });

  /**
   * Bonus — Whitespace trimming
   * Entering "  ORD001  " (with spaces) should still resolve.
   */
  it('Bonus — trims whitespace from order ID input', () => {
    const result = checkReturnEligibility('  ORD001  ');
    expect(result.found).toBe(true);
    expect(result.eligible).toBe(true);
  });
});
