import React, { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/currency';
import CreditDebitModal from './CreditDebitModal';
import AccountList from './AccountList';
import AccountDetails from './AccountDetails';
import Card from '../common/Card';
import Button from '../common/Button';

export default function CreditDebitCard() {
  const { state } = useExpense();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const totalCredit = state.creditDebitAccounts.reduce(
    (sum, account) => sum + account.totalCredit,
    0
  );

  const totalDebit = state.creditDebitAccounts.reduce(
    (sum, account) => sum + account.totalDebit,
    0
  );

  return (
    <>
      <Card
        title="Credit & Debit"
        icon={CreditCard}
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsTransactionModalOpen(true)}
          >
            Add Entry
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-sm font-medium text-red-400">To Pay</p>
            <p className="text-2xl font-bold text-red-300">
              {formatCurrency(totalCredit)}
            </p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-sm font-medium text-green-400">To Receive</p>
            <p className="text-2xl font-bold text-green-300">
              {formatCurrency(totalDebit)}
            </p>
          </div>
        </div>

        <AccountList onSelectAccount={setSelectedAccount} />
      </Card>

      {isTransactionModalOpen && (
        <CreditDebitModal onClose={() => setIsTransactionModalOpen(false)} />
      )}

      {selectedAccount && (
        <AccountDetails
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </>
  );
}