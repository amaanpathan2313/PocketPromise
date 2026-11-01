import { useMemo } from 'react';

/**
 * Hook that derives aggregate stats from loan data.
 */
export function useStats(activeLoans, paidLoans) {
  const stats = useMemo(() => {
    const totalLent = [...activeLoans, ...paidLoans].reduce(
      (sum, loan) => sum + (loan.amount || 0),
      0
    );

    const totalReceived = paidLoans.reduce(
      (sum, loan) => sum + (loan.amount || 0),
      0
    );

    const outstanding = activeLoans.reduce(
      (sum, loan) => sum + (loan.amount || 0),
      0
    );

    const overdueCount = activeLoans.filter(
      (loan) => loan.status === 'overdue'
    ).length;

    const totalBorrowers = new Set(
      [...activeLoans, ...paidLoans].map((l) => l.borrowerName.toLowerCase())
    ).size;

    return {
      totalLent,
      totalReceived,
      outstanding,
      overdueCount,
      totalBorrowers,
      activeCount: activeLoans.length,
      paidCount: paidLoans.length,
    };
  }, [activeLoans, paidLoans]);

  return stats;
}
