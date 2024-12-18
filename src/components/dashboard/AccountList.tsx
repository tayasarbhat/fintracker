import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/currency';
import { CreditDebitAccount } from '../../types/baseTypes';

interface Props {
  onSelectAccount: (account: CreditDebitAccount) => void;
}

export default function AccountList({ onSelectAccount }: Props) {
  const { state } = useExpense();

  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-sm font-medium text-white/80">All Accounts</h4>
      {state.creditDebitAccounts?.map((account) => (
        <button
          key={account.id}
          onClick={() => onSelectAccount(account)}
          className="w-full p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">{account.name}</p>
              {account.phoneNumber && (
                <p className="text-white/60 text-sm">{account.phoneNumber}</p>
              )}
            </div>
            <div className="text-right">
              {account.totalCredit > 0 && (
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{formatCurrency(account.totalCredit)}</span>
                </div>
              )}
              {account.totalDebit > 0 && (
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{formatCurrency(account.totalDebit)}</span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}