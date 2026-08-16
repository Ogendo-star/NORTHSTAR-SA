/**
 * returnsLogic.js
 *
 * Resolves "can I return this / where's my refund" tickets (Ticket Type 2)
 * without a human agent, per the rules in policy.md.
 *
 * Works in Node (via module.exports) and in the browser (attaches to
 * window.NorthstarReturns if no module system is present), so the
 * Frontend Engineer can call it directly from the chat UI either way.
 */

const RETURN_WINDOW_DAYS = 30;
const REFUND_PROCESSING_DAYS = "5-7 business days";

/**
 * @param {string} orderId - e.g. "ORD1001"
 * @param {Array<Object>} dataset - array of order records (see data/orders.json)
 * @param {Date} [currentDate] - defaults to now; pass a fixed date in tests
 * @returns {Object} a structured response the UI can render directly
 */
function returnsLookup(orderId, dataset, currentDate = new Date()) {
  if (!orderId || typeof orderId !== "string") {
    return {
      case: "invalid_input",
      message: "Please provide a valid order ID (e.g. ORD1001).",
    };
  }

  const order = dataset.find(
    (o) => o.orderId.toLowerCase() === orderId.trim().toLowerCase()
  );

  // Case: order not found
  if (!order) {
    return {
      case: "not_found",
      message: `We couldn't find an order with ID "${orderId}". Please double-check the order number.`,
    };
  }

  // Case: already returned/refunded — report refund status, not eligibility
  if (order.alreadyReturned) {
    return {
      case: "already_returned",
      message: buildRefundStatusMessage(order),
      orderId: order.orderId,
      refundStatus: order.refundStatus,
    };
  }

  // Case: not yet delivered
  if (order.status !== "delivered") {
    return {
      case: "not_delivered",
      message: `Your order (${order.item}) hasn't been delivered yet (current status: ${order.status}). Once it arrives, you'll have ${RETURN_WINDOW_DAYS} days to start a return.`,
      orderId: order.orderId,
    };
  }

  // Case: delivered — check the return window
  const deliveryDate = new Date(order.deliveryDate);
  const daysSinceDelivery = diffInDays(deliveryDate, currentDate);

  if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
    const windowClosed = addDays(deliveryDate, RETURN_WINDOW_DAYS);
    return {
      case: "expired",
      message: `Sorry, the return window for this order closed on ${formatDate(
        windowClosed
      )} (${RETURN_WINDOW_DAYS} days after delivery). This item is no longer eligible for return.`,
      orderId: order.orderId,
      windowClosedOn: formatDate(windowClosed),
    };
  }

  // Case: eligible
  const daysRemaining = RETURN_WINDOW_DAYS - daysSinceDelivery;
  return {
    case: "eligible",
    message: `Good news — your order (${order.item}) is eligible for return. You have ${daysRemaining} day(s) left in the return window. Once we receive the item back, refunds are processed within ${REFUND_PROCESSING_DAYS}.`,
    orderId: order.orderId,
    daysRemaining,
  };
}

// ---- helpers ----

function buildRefundStatusMessage(order) {
  switch (order.refundStatus) {
    case "processed":
      return `This order has already been returned and the refund has been processed. Please allow up to 2 business days for it to reflect in your account.`;
    case "requested":
      return `We've received your return request for this order and it's being processed. Refunds typically take ${REFUND_PROCESSING_DAYS} once the item reaches our warehouse.`;
    default:
      return `This order has already been marked as returned.`;
  }
}

function diffInDays(from, to) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((to - from) / msPerDay);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Export for Node/tests, and attach to window for direct browser use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { returnsLookup };
}
if (typeof window !== "undefined") {
  window.NorthstarReturns = { returnsLookup };
}
