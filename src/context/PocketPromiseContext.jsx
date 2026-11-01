import { createContext, useContext, useState, useEffect } from 'react';

const PocketPromiseContext = createContext(null);

export function PocketPromiseProvider({ children }) {
  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem('pocket_promise_loans');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was the old demo data (with 'CredoTrack borrower' or 'loan-1'), clear it out
        if (Array.isArray(parsed) && parsed.some((l) => l.id === 'loan-1' || l.debtor === 'CredoTrack borrower')) {
          localStorage.removeItem('pocket_promise_loans');
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [callingLoan, setCallingLoan] = useState(null);
  const [lightboxData, setLightboxData] = useState({ isOpen: false, images: [], title: '' });

  const openLightbox = (images, title = 'Loan Proof') => {
    setLightboxData({ isOpen: true, images: Array.isArray(images) ? images : [images], title });
  };

  const closeLightbox = () => {
    setLightboxData({ isOpen: false, images: [], title: '' });
  };

  useEffect(() => {
    try {
      localStorage.setItem('pocket_promise_loans', JSON.stringify(loans));
    } catch (e) {
      console.error('Failed to save loans to localStorage', e);
    }
  }, [loans]);

  // Dynamic Financial calculations
  const totalLent = loans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalRecovered = loans
    .filter((l) => l.statusType === 'repaid' || l.status === 'Repaid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const outstandingDebt = Math.max(0, totalLent - totalRecovered);
  const activeRemindersCount = loans.filter((l) => l.statusType !== 'repaid' && l.status !== 'Repaid').length;

  const addLoan = (newLoan) => {
    const formattedDate = newLoan.dueDate
      ? new Date(newLoan.dueDate).toLocaleDateString('en-GB')
      : new Date().toLocaleDateString('en-GB');

    const loanEntry = {
      id: `loan-${Date.now()}`,
      debtor: newLoan.debtor,
      avatar: newLoan.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newLoan.debtor)}&backgroundColor=00d2ff,0072ff`,
      amount: Number(newLoan.amount),
      dueDate: newLoan.dueDate,
      dueDateDisplay: formattedDate,
      status: newLoan.channel === 'ai_call' ? 'AI Call Scheduled' : newLoan.channel === 'sms' ? 'SMS Queued' : 'Email Sent',
      statusType: newLoan.channel || 'ai_call',
      phone: newLoan.phone || '',
      email: newLoan.email || '',
      imageUrls: Array.isArray(newLoan.imageUrls) ? newLoan.imageUrls : [],
      remindersCount: 1,
      notes: newLoan.notes || '',
      createdAt: new Date().toISOString(),
    };
    setLoans((prev) => [loanEntry, ...prev]);
  };

  const markAsRepaid = (loanId) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? { ...l, status: 'Repaid', statusType: 'repaid', repaidAt: new Date().toISOString() }
          : l
      )
    );
  };

  const deleteLoan = (loanId) => {
    setLoans((prev) => prev.filter((l) => l.id !== loanId));
  };

  const startAICall = (loan) => {
    setCallingLoan(loan);
  };

  const closeAICall = () => {
    setCallingLoan(null);
  };

  const filteredLoans = loans.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.debtor && l.debtor.toLowerCase().includes(q)) ||
      (l.status && l.status.toLowerCase().includes(q)) ||
      String(l.amount).includes(q)
    );
  });

  return (
    <PocketPromiseContext.Provider
      value={{
        loans: filteredLoans,
        allLoans: loans,
        totalLent,
        totalRecovered,
        outstandingDebt,
        activeRemindersCount,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        callingLoan,
        startAICall,
        closeAICall,
        lightboxData,
        openLightbox,
        closeLightbox,
        addLoan,
        markAsRepaid,
        deleteLoan,
      }}
    >
      {children}
    </PocketPromiseContext.Provider>
  );
}

export function usePocketPromise() {
  const context = useContext(PocketPromiseContext);
  if (!context) {
    throw new Error('usePocketPromise must be used within a PocketPromiseProvider');
  }
  return context;
}
