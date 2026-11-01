import { createContext, useContext, useState, useEffect } from 'react';

const PocketPromiseContext = createContext(null);

const INITIAL_LOANS = [
  {
    id: 'loan-1',
    debtor: 'CredoTrack borrower',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    amount: 14850,
    dueDate: '2024-10-01',
    dueDateDisplay: '01/10/2024',
    status: 'AI Call Scheduled',
    statusType: 'ai_call',
    phone: '+91 98765 43210',
    email: 'borrower1@example.com',
    remindersCount: 3,
    notes: 'Promised repayment for business inventory',
  },
  {
    id: 'loan-2',
    debtor: 'Kannie Birnieven',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    amount: 9320,
    dueDate: '2024-10-09',
    dueDateDisplay: '09/10/2024',
    status: 'Email Sent',
    statusType: 'email_sent',
    phone: '+91 98123 45678',
    email: 'kannie.b@example.com',
    remindersCount: 2,
    notes: 'Personal emergency loan',
  },
  {
    id: 'loan-3',
    debtor: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    amount: 5530,
    dueDate: '2024-10-09',
    dueDateDisplay: '09/10/2024',
    status: 'Repaid',
    statusType: 'repaid',
    phone: '+91 97654 32109',
    email: 'alex.rivera@example.com',
    remindersCount: 1,
    notes: 'Freelance equipment advance',
  },
  {
    id: 'loan-4',
    debtor: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    amount: 4200,
    dueDate: '2024-10-15',
    dueDateDisplay: '15/10/2024',
    status: 'AI Call Scheduled',
    statusType: 'ai_call',
    phone: '+91 99887 76655',
    email: 'david.m@example.com',
    remindersCount: 4,
    notes: 'Event budget support',
  },
  {
    id: 'loan-5',
    debtor: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    amount: 7800,
    dueDate: '2024-09-28',
    dueDateDisplay: '28/09/2024',
    status: 'Repaid',
    statusType: 'repaid',
    phone: '+91 98234 56789',
    email: 'sarah.c@example.com',
    remindersCount: 2,
    notes: 'Course fee loan',
  },
];

export function PocketPromiseProvider({ children }) {
  const [loans, setLoans] = useState(() => {
    try {
      const saved = localStorage.getItem('pocket_promise_loans');
      return saved ? JSON.parse(saved) : INITIAL_LOANS;
    } catch {
      return INITIAL_LOANS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [callingLoan, setCallingLoan] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('pocket_promise_loans', JSON.stringify(loans));
    } catch (e) {
      console.error('Failed to save loans to localStorage', e);
    }
  }, [loans]);

  // Financial calculations
  const totalLent = loans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalRecovered = loans
    .filter((l) => l.statusType === 'repaid' || l.status === 'Repaid')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const outstandingDebt = Math.max(0, totalLent - totalRecovered);
  const activeRemindersCount = loans.filter((l) => l.statusType !== 'repaid' && l.status !== 'Repaid').length * 2 + 8;

  const addLoan = (newLoan) => {
    const formattedDate = newLoan.dueDate ? new Date(newLoan.dueDate).toLocaleDateString('en-GB') : '12/10/2024';
    const loanEntry = {
      id: `loan-${Date.now()}`,
      debtor: newLoan.debtor,
      avatar: newLoan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newLoan.debtor)}`,
      amount: Number(newLoan.amount),
      dueDate: newLoan.dueDate,
      dueDateDisplay: formattedDate,
      status: newLoan.channel === 'ai_call' ? 'AI Call Scheduled' : newLoan.channel === 'sms' ? 'SMS Queued' : 'Email Sent',
      statusType: newLoan.channel || 'ai_call',
      phone: newLoan.phone || '+91 90000 00000',
      email: newLoan.email || 'borrower@example.com',
      remindersCount: 1,
      notes: newLoan.notes || '',
    };
    setLoans((prev) => [loanEntry, ...prev]);
  };

  const markAsRepaid = (loanId) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? { ...l, status: 'Repaid', statusType: 'repaid' }
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
      l.debtor.toLowerCase().includes(q) ||
      l.status.toLowerCase().includes(q) ||
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

