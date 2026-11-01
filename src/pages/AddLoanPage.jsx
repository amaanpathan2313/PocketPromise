import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddLoanForm from '../components/forms/AddLoanForm';
import { useLoans } from '../hooks/useLoans';
import { FiArrowLeft } from 'react-icons/fi';

export default function AddLoanPage() {
  const { addLoan } = useLoans();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await addLoan(data);
      toast.success('Loan record added!', {
        icon: '💰',
        style: {
          background: '#1a1a3e',
          color: '#f1f5f9',
          border: '1px solid rgba(16,185,129,0.3)',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add loan. Check your Firebase config.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => navigate(-1)}
          style={{ width: '36px', height: '36px' }}
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
            }}
          >
            Add <span className="gradient-text">New Loan</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Record a new lending transaction
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <AddLoanForm onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
}
