import { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiUser, FiDollarSign, FiMail, FiPhone, FiCalendar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AddLoanForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    borrowerName: '',
    amount: '',
    borrowerEmail: '',
    borrowerPhone: '',
  });
  const [promiseDate, setPromiseDate] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.borrowerName.trim()) {
      toast.error("Enter borrower's name");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!promiseDate) {
      toast.error('Select a promise date');
      return;
    }
    if (!formData.borrowerEmail.trim()) {
      toast.error("Enter borrower's email");
      return;
    }
    if (!formData.borrowerPhone.trim()) {
      toast.error("Enter borrower's phone number");
      return;
    }

    await onSubmit({
      ...formData,
      promiseDate,
    });

    // Reset form
    setFormData({
      borrowerName: '',
      amount: '',
      borrowerEmail: '',
      borrowerPhone: '',
    });
    setPromiseDate(null);
  };

  const fields = [
    {
      name: 'borrowerName',
      label: "Borrower's Name",
      icon: FiUser,
      type: 'text',
      placeholder: 'e.g. Rahul Sharma',
    },
    {
      name: 'amount',
      label: 'Amount (₹)',
      icon: FiDollarSign,
      type: 'number',
      placeholder: 'e.g. 5000',
    },
    {
      name: 'borrowerEmail',
      label: "Borrower's Email",
      icon: FiMail,
      type: 'email',
      placeholder: 'e.g. rahul@email.com',
    },
    {
      name: 'borrowerPhone',
      label: 'Phone Number',
      icon: FiPhone,
      type: 'tel',
      placeholder: 'e.g. +91 9876543210',
    },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      {fields.map((field, i) => (
        <motion.div
          key={field.name}
          className="input-group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <label className="input-label" htmlFor={field.name}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <field.icon size={14} />
              {field.label}
            </span>
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className="input"
            autoComplete="off"
          />
        </motion.div>
      ))}

      {/* Date Picker */}
      <motion.div
        className="input-group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label className="input-label">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FiCalendar size={14} />
            Promise Date
          </span>
        </label>
        <DatePicker
          selected={promiseDate}
          onChange={(date) => setPromiseDate(date)}
          minDate={new Date()}
          placeholderText="Select promise date"
          dateFormat="dd MMM yyyy"
          showPopperArrow={false}
        />
      </motion.div>

      {/* Submit */}
      <motion.button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        style={{ marginTop: '8px' }}
      >
        <FiSend size={18} />
        {loading ? 'Adding...' : 'Add Loan Record'}
      </motion.button>
    </motion.form>
  );
}
