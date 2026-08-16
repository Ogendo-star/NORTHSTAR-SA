import { useState } from 'react'
import OrderStatus from './components/OrderStatus'
import './App.css'

const SERVICES = [
  {
    key: 'orderStatus',
    letter: 'O',
    title: 'Order status',
    description: 'Check where your order is and when it will arrive.',
    enabled: true,
    accent: '#aa3bff',
    bg: 'rgba(170, 59, 255, 0.12)',
  },
  {
    key: 'returns',
    letter: 'R',
    title: 'Returns & refunds',
    description: 'Start a return or track a refund in progress.',
    enabled: false,
    accent: '#178d65',
    bg: 'rgba(23, 141, 101, 0.12)',
  },
  {
    key: 'stock',
    letter: 'S',
    title: 'Stock availability',
    description: 'See if an item is in stock before you order.',
    enabled: false,
    accent: '#c07a17',
    bg: 'rgba(192, 122, 23, 0.12)',
  },
]

function App() {
  const [view, setView] = useState('home')

  if (view === 'orderStatus') {
    return (
      <div className="page">
        <OrderStatus onBack={() => setView('home')} />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="dashboard-header">
        <h1>Northstar Support</h1>
        <p className="dashboard-subtitle">
          Everything you need to track, manage, and resolve your orders.
        </p>
      </header>
      <div className="header-rule" />

      <div className="services">
        {SERVICES.map((service) => (
          <button
            key={service.key}
            className="service-card"
            style={{ '--card-accent': service.accent, '--card-bg': service.bg }}
            onClick={() => service.enabled && setView(service.key)}
            disabled={!service.enabled}
          >
            <span className="service-mark">{service.letter}</span>
            <span className="service-title">{service.title}</span>
            <span className="service-description">{service.description}</span>
            {!service.enabled && <span className="service-soon">Coming soon</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
