import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  db,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from '../lib/firebase';

/**
 * Hook for CRUD operations on the loans collection.
 */
export function useLoans() {
  const { user } = useUser();
  const [activeLoans, setActiveLoans] = useState([]);
  const [paidLoans, setPaidLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Real-time listener for active/overdue loans
    const activeQuery = query(
      collection(db, 'loans'),
      where('lenderId', '==', user.id),
      where('status', 'in', ['active', 'overdue']),
      orderBy('promiseDate', 'asc')
    );

    const paidQuery = query(
      collection(db, 'loans'),
      where('lenderId', '==', user.id),
      where('status', '==', 'paid'),
      orderBy('paidAt', 'desc')
    );

    const unsubActive = onSnapshot(activeQuery, (snapshot) => {
      const loans = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Mark overdue loans
      const now = new Date();
      const processed = loans.map((loan) => {
        const promiseDate = loan.promiseDate?.toDate
          ? loan.promiseDate.toDate()
          : new Date(loan.promiseDate);
        if (now > promiseDate && loan.status !== 'paid') {
          return { ...loan, status: 'overdue' };
        }
        return loan;
      });
      setActiveLoans(processed);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching active loans:', error);
      setLoading(false);
    });

    const unsubPaid = onSnapshot(paidQuery, (snapshot) => {
      const loans = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPaidLoans(loans);
    }, (error) => {
      console.error('Error fetching paid loans:', error);
    });

    return () => {
      unsubActive();
      unsubPaid();
    };
  }, [user]);

  /**
   * Add a new loan record.
   */
  const addLoan = async (loanData) => {
    if (!user) throw new Error('Not authenticated');

    const newLoan = {
      lenderId: user.id,
      lenderName: user.fullName || user.firstName || 'Unknown',
      borrowerName: loanData.borrowerName,
      amount: Number(loanData.amount),
      currency: 'INR',
      promiseDate: Timestamp.fromDate(new Date(loanData.promiseDate)),
      borrowerEmail: loanData.borrowerEmail,
      borrowerPhone: loanData.borrowerPhone,
      status: 'active',
      reminderLanguageIndex: 0,
      lastReminderSentAt: null,
      reminderCount: 0,
      createdAt: serverTimestamp(),
      paidAt: null,
    };

    const docRef = await addDoc(collection(db, 'loans'), newLoan);
    return docRef.id;
  };

  /**
   * Mark a loan as paid.
   */
  const markAsPaid = async (loanId) => {
    const loanRef = doc(db, 'loans', loanId);
    await updateDoc(loanRef, {
      status: 'paid',
      paidAt: serverTimestamp(),
    });
  };

  return {
    activeLoans,
    paidLoans,
    loading,
    addLoan,
    markAsPaid,
  };
}
