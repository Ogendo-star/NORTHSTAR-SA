# Returns & Refunds Module

**Project:** Northstar Retail Co. — Support Deflection MVP  
**Responsibility:** Person 3 — Data & Logic Engineer B (Returns & Refunds)

---

## Purpose

This module allows customers to self-serve their returns and refunds questions by entering an Order ID. The system applies the agreed MVP return policy and returns a structured result — no human agent required for standard cases.

---

## Return Policy Rules (MVP)

| Rule | Detail |
|---|---|
| Return window | 30 days from delivery date |
| Eligible orders | Delivered orders within the 30-day window |
| Ineligible — not delivered | Order must be in "Delivered" status |
| Ineligible — window expired | Delivery date more than 30 days ago |
| Ineligible — already returned | returnStatus is "Returned" |
| Ineligible — already refunded | refundStatus is "Refund Completed" |
| Refund Pending | Return requested, refund not yet processed |
| Awaiting Item | Return approved, customer has not shipped item back yet |
| Not found | Order ID does not exist in the data |

> The 30-day return window is an MVP team design decision.

---

## Files

| File | Role |
|---|---|
| `src/logic/returns.js` | Business logic — all return/refund rules live here |
| `src/logic/returns.test.js` | Vitest test suite (10 tests) |
| `src/components/Returns.jsx` | React UI — order ID input + result display |
| `src/components/ReturnInstructions.jsx` | React UI — policy summary (presentational only) |
| `data/orders.json` | Mock order data covering all test scenarios |

---

## Data Fields Used

Each order in `data/orders.json` uses these fields:

| Field | Type | Description |
|---|---|---|
| `orderId` | string | Unique order identifier e.g. `"ORD001"` |
| `customerName` | string | Customer display name |
| `product` | string | Product description |
| `orderStatus` | string | `"Delivered"`, `"Processing"`, etc. |
| `deliveryDate` | string \| null | ISO date `"YYYY-MM-DD"`, or `null` if not delivered |
| `returnStatus` | string | `"Not Requested"`, `"Return Requested"`, `"Return Approved"`, `"Returned"` |
| `refundStatus` | string | `"Not Requested"`, `"Refund Pending"`, `"Refund Completed"` |

---

## Business Logic Function

### `checkReturnEligibility(orderId)`

**Location:** `src/logic/returns.js`  
**Import:** `import { checkReturnEligibility } from '../logic/returns.js';`

#### Input

| Parameter | Type | Description |
|---|---|---|
| `orderId` | string | The order ID to look up. Case-insensitive, whitespace is trimmed. |

#### Output

```js
{
  found: boolean,       // true if the order exists
  eligible: boolean,    // true if the order can be returned right now
  returnStatus: string | null,  // current return status, or null if not found
  refundStatus: string | null,  // current refund status, or null if not found
  message: string       // human-readable explanation of the result
}
```

#### Examples

```js
// Eligible order
checkReturnEligibility('ORD001')
// {
//   found: true,
//   eligible: true,
//   returnStatus: "Not Requested",
//   refundStatus: "Not Requested",
//   message: "This order is eligible for return. You have 4 day(s) remaining..."
// }

// Already refunded
checkReturnEligibility('ORD004')
// {
//   found: true,
//   eligible: false,
//   returnStatus: "Returned",
//   refundStatus: "Refund Completed",
//   message: "This order has already been returned and refunded."
// }

// Not found
checkReturnEligibility('ORD999')
// {
//   found: false,
//   eligible: false,
//   returnStatus: null,
//   refundStatus: null,
//   message: "Order Not Found."
// }
```

Also exported: `RETURN_WINDOW_DAYS` (number, currently `30`) and `daysSinceDelivery(deliveryDate)` (utility).

---

## Test Cases

Run with: `npm test`

| # | Input | Expected outcome |
|---|---|---|
| 1 | `ORD001` | Eligible — within 30-day window |
| 2 | `ORD002` | Not eligible — return window expired |
| 3 | `ORD003` | Not eligible — already returned |
| 4 | `ORD004` | Not eligible — refund completed |
| 5 | `ORD999` | Order Not Found |
| 6 | `ORD005` | Not eligible — not yet delivered |
| 7 | `ORD006` | Refund Pending |
| 8 | `ORD007` | Return Approved — Awaiting Item |
| Bonus | `ord001` | Eligible — case-insensitive match |
| Bonus | `  ORD001  ` | Eligible — whitespace trimmed |

All 10 tests pass as of implementation.

---

## Mock Data Scenarios

| Order ID | Scenario |
|---|---|
| `ORD001` | Delivered, within 30-day window — eligible |
| `ORD002` | Delivered, more than 30 days ago — window expired |
| `ORD003` | Delivered, already returned and refunded |
| `ORD004` | Delivered, already returned and refunded (second example) |
| `ORD005` | Still processing — not yet delivered |
| `ORD006` | Return requested — refund pending |
| `ORD007` | Return approved — awaiting item shipment |
| `ORD008` | Delivered, within window — second eligible example |

---

## Frontend Integration

The customer flow is:

```
Customer enters Order ID
        ↓
Returns UI (Returns.jsx)
        ↓
checkReturnEligibility() in src/logic/returns.js
        ↓
orders.json (mock data)
        ↓
Business rules applied
        ↓
Result displayed: eligibility + return status + refund status + message
```

The UI component (`Returns.jsx`) contains no business logic. All rules are in `src/logic/returns.js`, making it reusable from any other component or future integration layer.

---

## How to Test Manually

1. Start the dev server: `npm run dev`
2. Open the app in the browser (usually `http://localhost:5173`)
3. Click **Returns & Refunds**
4. Enter each Order ID below and verify the result:

| Enter | Expect |
|---|---|
| `ORD001` | Eligible — days remaining shown |
| `ORD002` | Not eligible — window expired |
| `ORD003` | Not eligible — already returned and refunded |
| `ORD004` | Not eligible — refund completed |
| `ORD005` | Not eligible — not yet delivered |
| `ORD006` | Not eligible — refund pending |
| `ORD007` | Not eligible — return approved, awaiting item |
| `ORD008` | Eligible — days remaining shown |
| `ORD999` | Order Not Found |
| `ord001` | Eligible (case-insensitive) |

5. Run automated tests: `npm test`
6. Run build check: `npm run build`

---

## Known Limitations (MVP)

- Data is static JSON — no real database or API.
- No authentication — any user can look up any order ID.
- No ability to actually submit a return request through the UI (lookup only).
- Dates in `orders.json` are fixed — eligibility results will shift over time as the current date advances past the 30-day window.
- No email or notification flow.

---

## Suggested Commit Message

```
feat: add returns-refunds lookup logic - enables self-service return status
```
