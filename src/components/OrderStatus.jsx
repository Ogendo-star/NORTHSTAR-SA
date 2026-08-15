import { useState } from 'react'
import { getOrderStatus } from '../orderLookup'
import './OrderStatus.css'

function OrderStatus({ onBack }) {
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)

  function handleCheck() {
    setResult(getOrderStatus(orderId))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCheck()
  }

  return (
    <div className="order-status">
      <button className="back-link" onClick={onBack}>← Back</button>

      <h2>Where's my order?</h2>
      <p className="subtitle">Enter your order ID to check its status.</p>

      <div className="order-status-form">
        <input
          type="text"
          placeholder="e.g. ORD-1002"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleCheck}>Check order</button>
      </div>

      {!result && (
        <p className="empty-hint">Your order details will appear here.</p>
      )}

      {result && result.error && (
        <div className="order-result error">
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="order-result">
          <p className="order-id">Order {result.order_id}</p>
          <p className={`status-badge status-${result.status.toLowerCase()}`}>
            {result.status.replace(/_/g, ' ')}
          </p>
          <p className="message">{result.message}</p>
          <div className="details">
            <div>
              <span className="label">Expected delivery</span>
              <span className="value">{result.expected_delivery}</span>
            </div>
            <div>
              <span className="label">Last updated</span>
              <span className="value">{result.last_update}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderStatus