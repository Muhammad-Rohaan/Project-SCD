// src/components/Admin/FinancePage.jsx
import React, { useState, useEffect } from 'react';
import { getPendingFees, getTotalRevenue, getAllTransactions } from '../../api/finance';

const FinancePage = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingFees, setPendingFees] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const revenueData = await getTotalRevenue();
                setTotalRevenue(revenueData.totalRevenue);

                const pendingData = await getPendingFees();
                setPendingFees(pendingData.pending);

                const transactionData = await getAllTransactions();
                setTransactions(transactionData.transactions);
            } catch (err) {
                setError('Failed to fetch finance data');
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AZ Finance Management
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-bold text-white">Total Revenue</h2>
                    <p className="text-4xl font-extrabold text-green-400">Rs {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                    <h2 className="text-2xl font-bold text-white">Pending Fees</h2>
                    <p className="text-4xl font-extrabold text-yellow-400">{pendingFees.length}</p>
                </div>
            </div>

            <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">All Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-cyan-400/30 rounded-2xl overflow-hidden">
                        <thead className="bg-indigo-900/50">
                            <tr>
                                <th className="p-4 text-cyan-300">Student Name</th>
                                <th className="p-4 text-cyan-300">Roll No</th>
                                <th className="p-4 text-cyan-300">Amount</th>
                                <th className="p-4 text-cyan-300">Status</th>
                                <th className="p-4 text-cyan-300">Month/Year</th>
                                <th className="p-4 text-cyan-300">Collected By</th>
                                <th className="p-4 text-cyan-300">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction._id} className="border-t border-cyan-400/20">
                                    <td className="p-4 text-white">{transaction.studentName}</td>
                                    <td className="p-4 text-white">{transaction.rollNo}</td>
                                    <td className="p-4 text-white">Rs {transaction.feesAmount.toLocaleString()}</td>
                                    <td className="p-4 text-white">
                                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white">{transaction.month}/{transaction.year}</td>
                                    <td className="p-4 text-white">{transaction.collectedBy}</td>
                                    <td className="p-4 text-white">{new Date(transaction.collectedDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancePage;
