import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layouts
import CompanyLayout from './layouts/CompanyLayout'
import PosLayout from './layouts/PosLayout'

// Company pages
import HomePage from './pages/company/HomePage'
import AboutPage from './pages/company/AboutPage'
import ServicesPage from './pages/company/ServicesPage'
import ContactPage from './pages/company/ContactPage'

// POS pages
import DashboardPage from './pages/pos/DashboardPage'
import CashierPage from './pages/pos/CashierPage'
import ProductsPage from './pages/pos/ProductsPage'
import TransactionsPage from './pages/pos/TransactionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Company Profile */}
        <Route element={<CompanyLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Sistem POS */}
        <Route path="/pos" element={<PosLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="cashier" element={<CashierPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
