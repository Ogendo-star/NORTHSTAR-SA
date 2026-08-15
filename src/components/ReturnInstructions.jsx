/**
 * ReturnInstructions.js
 * Displays the Northstar Retail Co. Returns & Refunds policy to the customer.
 *
 * Responsibility: Person 3 — Data & Logic Engineer B (Returns & Refunds)
 * This component is purely presentational — no logic lives here.
 */

import React from 'react';

function ReturnInstructions() {
  return (
    <div className="return-instructions">
      <h3>Returns &amp; Refunds Policy</h3>
      <ul>
        <li>Returns are accepted within <strong>30 days</strong> of delivery.</li>
        <li>Only <strong>delivered</strong> orders are eligible for return.</li>
        <li>Orders that have already been returned or refunded cannot be returned again.</li>
        <li>Once a return is approved, please ship the item back promptly.</li>
        <li>Refunds are processed after the returned item is received and inspected.</li>
        <li>To start a return, enter your Order ID below and check your eligibility.</li>
      </ul>
    </div>
  );
}

export default ReturnInstructions;
