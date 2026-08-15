import orders from "../data/orders.json";

const STATUS_MESSAGES = {
  PROCESSING: "Your order is being prepared.",
  SHIPPED: "Your order has shipped.",
  OUT_FOR_DELIVERY: "Your order is out for delivery.",
  DELIVERED: "Your order has been delivered.",
  DELAYED: "Your order has been delayed.",
};

/**
 * Look up an order by ID and return a dashboard-ready result.
 *
 * Returns:
 *   { order_id, status, message, expected_delivery, last_update }
 *   OR { error } if the order isn't found / input is invalid
 */
export function getOrderStatus(orderId) {
  if (!orderId || !orderId.trim()) {
    return { error: "Please enter an order ID." };
  }

  const normalizedId = orderId.trim().toUpperCase(); // "ord-1002" -> "ORD-1002"

  const record = orders.find((o) => o.order_id === normalizedId);

  if (!record) {
    return { error: "We couldn't find that order. Please check your order ID." };
  }

  return {
    order_id: record.order_id,
    status: record.status,
    message: STATUS_MESSAGES[record.status],
    expected_delivery: record.expected_delivery,
    last_update: record.last_update,
  };
}