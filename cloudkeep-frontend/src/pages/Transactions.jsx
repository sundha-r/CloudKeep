import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { useAuth } from '@clerk/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../util/apiEndpoints';
import { Receipt, AlertCircle, CheckCircle2, Loader2, CreditCard } from 'lucide-react';

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(API_ENDPOINTS.GET_TRANSACTIONS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load your transaction history. Please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [getToken]);

  const formatDate=(dateString)=>{
    const options={
      year:"numeric",
      month:"long",
      day:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined,options);
  };

  const formatAmount=(amountInPaise)=>{
    return `₹${(amountInPaise/100).toFixed(2)}`;
  };


  
  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Receipt className='text-blue-600'/>
          <h2 className="text-2xl font-bold">Transaction History</h2>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3 border bg-red-500/10 border-red-500 text-red-700">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
            <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
            <p className="text-gray-500 text-sm">Loading transaction history...</p>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Receipt size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No transactions yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              You haven't made any subscription purchases yet. Upgrade your plan to get more credits.
            </p>
            <Link
              to="/subscription"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
            >
              View Plans
            </Link>
          </div>
        ) : (
          /* Transactions Table */
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Plan & ID
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {transactions.map((transaction) => (
                  <tr key={transaction.id || transaction.orderId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 capitalize">
                            {transaction.planId ? `${transaction.planId} Plan` : "Credits Top-up"}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {transaction.paymentId.substring(0,12)+"..." || transaction.orderId || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        +{transaction.creditsAdded || 0} Credits
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200/60">
                          <CheckCircle2 size={13} className="text-green-600" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200/60">
                          {transaction.status || "Pending"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Transactions