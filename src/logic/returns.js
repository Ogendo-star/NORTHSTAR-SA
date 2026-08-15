/**
 * returns.js
 * Returns & Refunds business logic for Northstar Retail Co. Support Deflection MVP.
 *
 * Responsibility: Person 3 — Data & Logic Engineer B (Returns & Refunds)
 *
 * Policy:
 *  - Delivered orders are eligible for return within 30 days of delivery.
 *  - Orders outside the 30-day window are not eligible.
 *  - Orders already returned or refunded cannot be returned again.
 *  - Orders not yet delivered cannot be returned.
 *  - Refund Pending: return requested but refund not yet processed.
 *  - Return Approved — Awaiting Item: approved but item not shipped back.
 */

import ordersData from '../../data/orders.json';

/** Number of days in the return window (MVP team decision). */
export const RETURN_WINDOW_DAYS = 30;

/**
 * Returns the number of days between a delivery date and today.
 * @param {string} deliveryDate - ISO date string e.g. "2026-07-20"
 * @returns {number} Days elapsed since delivery (positive = past).
 */
export function daysSinceDelivery(deliveryDate) {
  const delivery = new Date(deliveryDate);
  const today = new Date();
  // Zero out time components for a clean day-level comparison
  delivery.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((today - delivery) / msPerDay);
}

/**
 * Checks return and refund eligibility for a given order ID.
 *
 * @param {string} orderId - The order ID to look up (e.g. "ORD001").
 * @returns {{
 *   found: boolean,
 *   eligible: boolean,
 *   returnStatus: string|null,
 *   refundStatus: string|null,
 *   message: string
 * }}
 */
export function checkReturnEligibility(orderId) {
  // --- Order lookup ---
  const order = ordersData.find(
    (o) => o.orderId.toLowerCase() === orderId.trim().toLowerCase()
  );

  if (!order) {
    return {
      found: false,
      eligible: false,
      returnStatus: null,
      refundStatus: null,
      message: 'Order Not Found.',
    };
  }

  const { orderStatus, deliveryDate, returnStatus, refundStatus } = order;

  // --- Already refunded ---
  if (refundStatus === 'Refund Completed') {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: 'This order has already been returned and refunded.',
    };
  }

  // --- Refund pending (return requested, refund not yet processed) ---
  if (refundStatus === 'Refund Pending') {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: 'A return has been requested. Your refund is currently pending.',
    };
  }

  // --- Return approved, awaiting item shipment ---
  if (returnStatus === 'Return Approved') {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: 'Return Approved — Awaiting Item. Please ship your item back to complete the return.',
    };
  }

  // --- Already returned (without explicit refund status above) ---
  if (returnStatus === 'Returned') {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: 'This order has already been returned.',
    };
  }

  // --- Not yet delivered ---
  if (orderStatus !== 'Delivered' || !deliveryDate) {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: `This order has not been delivered yet (status: ${orderStatus}). Returns are only available for delivered orders.`,
    };
  }

  // --- Return window check ---
  const daysElapsed = daysSinceDelivery(deliveryDate);

  if (daysElapsed > RETURN_WINDOW_DAYS) {
    return {
      found: true,
      eligible: false,
      returnStatus,
      refundStatus,
      message: `The 30-day return window has expired. This order was delivered ${daysElapsed} days ago.`,
    };
  }

  // --- Eligible ---
  return {
    found: true,
    eligible: true,
    returnStatus,
    refundStatus,
    message: `This order is eligible for return. You have ${RETURN_WINDOW_DAYS - daysElapsed} day(s) remaining in your return window.`,
  };
}
