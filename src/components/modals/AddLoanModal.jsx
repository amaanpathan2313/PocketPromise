import { useState, useRef } from 'react';
import { FiX, FiPhone, FiMail, FiUser, FiUploadCloud, FiTrash2, FiImage, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { usePocketPromise } from '../../context/PocketPromiseContext';
import { compressImage, formatFileSize } from '../../lib/imageCompressor';
import { uploadLoanImages } from '../../lib/firebaseStorage';

export default function AddLoanModal() {
  const { isAddModalOpen, setIsAddModalOpen, addLoan } = usePocketPromise();
  const fileInputRef = useRef(null);

  const [debtor, setDebtor] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [channel, setChannel] = useState('ai_call');
  const [notes, setNotes] = useState('');

  // Image upload & compression state
  const [images, setImages] = useState([]); // [{ file, blob, dataUrl, originalSize, compressedSize, savedPercent, id }]
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddModalOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 3) {
      toast.error('You can upload a maximum of 3 proof images.');
      return;
    }

    setIsCompressing(true);
    const toastId = toast.loading('Compressing images for ultra-low storage...', {
      style: { background: '#0c101d', color: '#00D2FF', border: '1px solid #00D2FF' },
    });

    try {
      const compressedResults = await Promise.all(
        selectedFiles.map(async (file) => {
          const res = await compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.72,
          });
          return {
            ...res,
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
          };
        })
      );

      setImages((prev) => [...prev, ...compressedResults].slice(0, 3));
      toast.success(
        `Compressed ${compressedResults.length} image${compressedResults.length > 1 ? 's' : ''} (saved up to 95% storage!)`,
        { id: toastId, icon: '⚡' }
      );
    } catch (err) {
      console.error('Compression error:', err);
      toast.error('Failed to compress some images.', { id: toastId });
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!debtor.trim() || !amount || !dueDate) {
      toast.error('Please fill in Debtor Name, Amount, and Due Date');
      return;
    }

    setIsSubmitting(true);
    const submitToast = toast.loading(
      images.length > 0 ? 'Uploading proof to Firebase Storage...' : 'Saving loan record...',
      { style: { background: '#0c101d', color: '#f1f5f9' } }
    );

    try {
      const tempLoanId = `loan_${Date.now()}`;
      let uploadedUrls = [];

      if (images.length > 0) {
        uploadedUrls = await uploadLoanImages(images, tempLoanId);
      }

      addLoan({
        debtor: debtor.trim(),
        amount: parseFloat(amount),
        phone: phone.trim(),
        email: email.trim(),
        dueDate,
        channel,
        notes: notes.trim(),
        imageUrls: uploadedUrls,
      });

      toast.success(
        `Loan recorded for ${debtor} with ${uploadedUrls.length} verified proof${uploadedUrls.length !== 1 ? 's' : ''}!`,
        { id: submitToast, icon: '🚀' }
      );

      // Reset
      setIsAddModalOpen(false);
      setDebtor('');
      setAmount('');
      setPhone('');
      setEmail('');
      setDueDate('');
      setNotes('');
      setImages([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save loan. Please try again.', { id: submitToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={() => !isSubmitting && setIsAddModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#0e1424',
          border: '1px solid rgba(0, 210, 255, 0.25)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px 28px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 210, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                margin: 0,
              }}
            >
              Add New Loan
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
              Track money lent, attach verified receipts, and automate AI follow-ups
            </p>
          </div>

          <button
            onClick={() => !isSubmitting && setIsAddModalOpen(false)}
            disabled={isSubmitting}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Debtor Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
              Debtor Name *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiUser size={16} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={debtor}
                onChange={(e) => setDebtor(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#141b2d',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 14px 10px 38px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Amount & Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Amount (₹ INR) *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#00D2FF', fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 34px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Promise Payback Date *
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Phone & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Phone (For AI Voice Calls)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiPhone size={15} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Email (For Statements)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail size={15} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#141b2d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px 14px 10px 36px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Proof Images Upload (2-3 Images with High Compression) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiImage size={14} color="#00D2FF" />
                Proof Documents & Receipts ({images.length}/3)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#00D2FF', fontWeight: 600 }}>
                ⚡ Auto-Compressed
              </span>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={isCompressing || isSubmitting || images.length >= 3}
            />

            {/* Upload Drop Zone if less than 3 images */}
            {images.length < 3 && (
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: '1.5px dashed rgba(0, 210, 255, 0.3)',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 210, 255, 0.04)',
                  padding: '14px',
                  textAlign: 'center',
                  cursor: isCompressing ? 'wait' : 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: images.length > 0 ? '10px' : '0',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00D2FF')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)')}
              >
                {isCompressing ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#00D2FF' }}>
                    <FiLoader className="animate-spin" size={18} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Compressing & optimizing image...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FiUploadCloud size={20} color="#00D2FF" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#ffffff', fontSize: '0.84rem', fontWeight: 600 }}>
                        Click to upload receipts, promissory notes, or ID proof
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.72rem' }}>
                        Supports JPG, PNG, WEBP (Max 3 images • Auto-compressed by &gt;90%)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Cards */}
            {images.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {images.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#141b2d',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={item.dataUrl}
                        alt="Preview"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          border: '1px solid rgba(0, 210, 255, 0.3)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '220px',
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
                          <span style={{ color: '#64748b' }}>{formatFileSize(item.originalSize)}</span>
                          <span style={{ color: '#00D2FF' }}>→ {formatFileSize(item.compressedSize)}</span>
                          <span
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                            }}
                          >
                            -{item.savedPercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      disabled={isSubmitting}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '6px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#f43f5e')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Reminder Channel */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
              Primary Automated Follow-Up Channel
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'ai_call', label: '🎙️ AI Voice Call' },
                { id: 'email_sent', label: '✉️ Email Notice' },
                { id: 'sms', label: '💬 SMS Text' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChannel(opt.id)}
                  style={{
                    backgroundColor: channel === opt.id ? 'rgba(0, 210, 255, 0.15)' : '#141b2d',
                    border: channel === opt.id ? '1px solid #00D2FF' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: channel === opt.id ? '#00D2FF' : '#94a3b8',
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              style={{
                flex: 2,
                backgroundColor: '#0072FF',
                backgroundImage: 'linear-gradient(135deg, #0072FF 0%, #00D2FF 100%)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: isSubmitting || isCompressing ? 'wait' : 'pointer',
                boxShadow: '0 4px 16px rgba(0, 114, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isSubmitting || isCompressing ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  <span>Saving & Uploading Proof...</span>
                </>
              ) : (
                <span>Save & Activate Reminders</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
