# Order Status API

Live at: `http://localhost:8000/order-status/{order_id}`
Method: GET

**Success response:**
```json
{
  "order_id": "ORD-1002",
  "status": "SHIPPED",
  "message": "Your order has shipped.",
  "expected_delivery": "2026-08-17",
  "last_update": "2026-08-14"
}
```

**Error response (not found or empty input):**
```json
{ "error": "We couldn't find that order. Please check your order ID." }
```

Test IDs: ORD-1001 to ORD-1012 (see `data/orders.json` for statuses).
Statuses: PROCESSING, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, DELAYED.

To run locally: `cd scripts && python -m uvicorn api:app --reload`
