/**
 * Returns.js
 * Returns & Refunds UI component for Northstar Retail Co. Support Deflection MVP.
 *
 * Responsibility: Person 3 — Data & Logic Engineer B (Returns & Refunds)
 *
 * This component:
 *  - Accepts an Order ID from the customer via a text input.
 *  - Calls checkReturnEligibility() from the business logic module.
 *  - Displays eligibility, return status, refund status, and a clear message.
 *  - Does NOT contain any business rule logic — all rules live in src/logic/returns.js.
 */

import React, { useState } from 'react';
import { checkReturnEligibility } from '../logic/returns.js';
import ReturnInstructions from './ReturnInstructions.jsx';

function Returns() {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState(null);

  function handleCheck() {
    if (!orderId.trim()) return;
    const outcome = checkReturnEligibility(orderId);
    setResult(outcome);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCheck();
  }

  function handleReset() {
    setOrderId('');
    setResult(null);
  }

  return (
    <div className="returns-container">
      <h2>Returns &amp; Refunds</h2>

      {/* Policy summary */}
      <ReturnInstructions />

      {/* Order ID lookup */}
      <div className="returns-lookup">
        <label htmlFor="returns-order-id">
          Enter your Order ID:
        </label>
        <div className="returns-input-row">
          <input
            id="returns-order-id"
            type="text"
            placeholder="e.g. ORD001"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Order ID"
          />
          <button onClick={handleCheck} disabled={!orderId.trim()}>
            Check Return
          </button>
          {result && (
            <button onClick={handleReset} className="returns-reset-btn">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result display */}
      {result && (
        <div
          className={`returns-result ${result.eligible ? 'returns-result--eligible' : 'returns-result--ineligible'}`}
          role="region"
          aria-live="polite"
          aria-label="Return eligibility result"
        >
          {!result.found ? (
            <p className="returns-not-found">{result.message}</p>
          ) : (
            <>
              <div className="returns-result-row">
                <span className="returns-label">Return Eligible:</span>
                <span className={`returns-badge ${result.eligible ? 'badge--yes' : 'badge--no'}`}>
                  {result.eligible ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="returns-result-row">
                <span className="returns-label">Return Status:</span>
                <span className="returns-value">{result.returnStatus}</span>
              </div>
              <div className="returns-result-row">
                <span className="returns-label">Refund Status:</span>
                <span className="returns-value">{result.refundStatus}</span>
              </div>
              <p className="returns-message">{result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Returns;
