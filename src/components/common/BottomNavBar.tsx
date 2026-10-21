import React, { useEffect, useState } from 'react';
import { ChevronRight, Home, LayoutGrid, RotateCcw, ScanFace, ShoppingCart } from 'lucide-react';
import { useApp, ScreenName } from '../../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const { currentScreen, navigate, cartItemCount, cartAuthoritative, skinReports } = useApp();
  const [reportCommerceVisible, setReportCommerceVisible] = useState(false);

  useEffect(() => {
    if (currentScreen !== 'skin-report') setReportCommerceVisible(false);
    const handleReveal = (event: Event) => setReportCommerceVisible(Boolean((event as CustomEvent<{ visible: boolean }>).detail?.visible));
    window.addEventListener('glowvai:commerce-reveal', handleReveal);
    return () => window.removeEventListener('glowvai:commerce-reveal', handleReveal);
  }, [currentScreen]);

  const hidden: ScreenName[] = ['welcome', 'onboarding', 'login', 'otp', 'face-prep', 'face-capture', 'face-loading', 'cart', 'checkout', 'customer-details', 'payment-status', 'order-confirmation', 'order-cancelled', 'order-tracking'];
  if (hidden.includes(currentScreen) || (currentScreen === 'skin-report' && !reportCommerceVisible)) return null;

  const vaithraDestination: ScreenName = skinReports.length > 0 ? 'skin-report' : 'face-prep';
  const navItems = [
    { label: 'Home', screen: 'home' as ScreenName, icon: <Home size={20} /> },
    { label: 'Order Again', screen: 'order-history' as ScreenName, icon: <RotateCcw size={20} /> },
    { label: 'Categories', screen: 'categories' as ScreenName, icon: <LayoutGrid size={20} /> },
    { label: 'Skin scan', screen: vaithraDestination, icon: <ScanFace size={20} /> },
    { label: 'vaithra', screen: vaithraDestination, brand: true },
  ];

  return (
    <div className="bottom-commerce-shell">
      {cartItemCount > 0 && currentScreen !== 'cart' && (
        <button onClick={() => navigate('cart')} className="mini-cart-bar" aria-label={`View cart, ${cartItemCount} items, ₹${cartAuthoritative.finalPayable}`}>
          <span className="mini-cart-icon"><ShoppingCart size={20} /></span>
          <span className="mini-cart-copy"><b>View cart</b><small>{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} · ₹{cartAuthoritative.finalPayable}</small></span>
          <span className="mini-cart-action"><ChevronRight size={17} /></span>
        </button>
      )}
      <nav className="quick-bottom-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = currentScreen === item.screen || (item.screen === 'order-history' && ['order-tracking', 'streak-tracking'].includes(currentScreen));
          return <button key={item.label} onClick={() => navigate(item.screen)} aria-current={active ? 'page' : undefined} className={`${active ? 'is-active' : ''}${item.brand ? ' is-vaithra' : ''}`}>
            {item.brand ? <span className="vaithra-mark">vaithra</span> : item.icon}
            {!item.brand && <span>{item.label}</span>}
          </button>;
        })}
      </nav>
    </div>
  );
};
