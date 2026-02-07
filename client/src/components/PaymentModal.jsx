import { useState } from 'react';
import { MOCK_PAYMENT_PROVIDERS } from '../constants/payments';
import { X, CheckCircle, Smartphone, CreditCard, Wallet } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, totalAmount, onConfirm, bookingLoading }) => {
    const [step, setStep] = useState('select'); // select | processing | complete
    const [selectedMethod, setSelectedMethod] = useState(null);

    if (!isOpen) return null;

    const handlePay = () => {
        if (!selectedMethod) return;
        setStep('processing');
        setTimeout(() => {
            onConfirm(); // Trigger backend call
        }, 2000);
    };

    const getIcon = (id) => {
        switch (id) {
            case 'upi': return <Smartphone size={24} color="#f84464" />;
            case 'card': return <CreditCard size={24} color="#f84464" />;
            case 'wallet': return <Wallet size={24} color="#f84464" />;
            default: return null;
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
            <div style={{
                background: '#fff', width: '90%', maxWidth: '400px', borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                        {step === 'select' ? 'Payment Options' : step === 'processing' ? 'Processing...' : 'Booking Confirmed!'}
                    </h3>
                    <X size={20} style={{ cursor: 'pointer', color: '#888' }} onClick={onClose} />
                </div>

                <div style={{ padding: '20px' }}>

                    {step === 'select' && (
                        <>
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Total Payable Amount</span>
                                <h1 style={{ fontSize: '2rem', margin: '5px 0', color: '#333' }}>${totalAmount.toFixed(2)}</h1>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {MOCK_PAYMENT_PROVIDERS.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedMethod(p.id)}
                                        style={{
                                            padding: '15px', borderRadius: '8px', border: `1px solid ${selectedMethod === p.id ? '#f84464' : '#eee'}`,
                                            display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                                            background: selectedMethod === p.id ? 'rgba(248, 68, 100, 0.05)' : '#fff',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {getIcon(p.id)}
                                        <span style={{ fontWeight: '500', color: '#333' }}>{p.name}</span>
                                        {selectedMethod === p.id && <CheckCircle size={18} color="#f84464" style={{ marginLeft: 'auto' }} />}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={!selectedMethod}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '1rem', opacity: selectedMethod ? 1 : 0.5 }}
                            >
                                Pay Now
                            </button>
                        </>
                    )}

                    {step === 'processing' && (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <div className="spinner" style={{
                                width: '50px', height: '50px', border: '4px solid #f3f3f3',
                                borderTop: '4px solid #f84464', borderRadius: '50%', margin: '0 auto 20px',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <p style={{ color: '#666' }}>Verifying payment...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Spinner Style */}
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PaymentModal;
