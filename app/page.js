// app/page.js
import React from 'react';
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaShoppingCart,
  FaWallet,
  FaChartLine,
  FaReceipt,
  FaCreditCard,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaEllipsisH,
} from 'react-icons/fa';

export default function Home() {
  // Static data for the dashboard
  const stats = [
    {
      title: 'Total Balance',
      amount: '$24,560.00',
      change: '+12.5%',
      positive: true,
      icon: <FaWallet className="text-blue-500" size={24} />,
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Monthly Income',
      amount: '$8,420.00',
      change: '+8.2%',
      positive: true,
      icon: <FaMoneyBillWave className="text-green-500" size={24} />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Monthly Expenses',
      amount: '$3,250.00',
      change: '-2.4%',
      positive: false,
      icon: <FaShoppingCart className="text-red-500" size={24} />,
      bgColor: 'bg-red-100',
    },
    {
      title: 'Investments',
      amount: '$12,430.00',
      change: '+5.3%',
      positive: true,
      icon: <FaChartLine className="text-purple-500" size={24} />,
      bgColor: 'bg-purple-100',
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      name: 'Grocery Shopping',
      date: 'May 15, 2025',
      amount: -125.50,
      category: 'Food',
      icon: <FaShoppingCart className="text-red-400" />,
    },
    {
      id: 2,
      name: 'Salary Deposit',
      date: 'May 14, 2025',
      amount: 4250.00,
      category: 'Income',
      icon: <FaMoneyBillWave className="text-green-400" />,
    },
    {
      id: 3,
      name: 'Netflix Subscription',
      date: 'May 12, 2025',
      amount: -15.99,
      category: 'Entertainment',
      icon: <FaReceipt className="text-blue-400" />,
    },
    {
      id: 4,
      name: 'Stock Dividends',
      date: 'May 10, 2025',
      amount: 230.00,
      category: 'Investment',
      icon: <FaChartLine className="text-purple-400" />,
    },
    {
      id: 5,
      name: 'Coffee Shop',
      date: 'May 9, 2025',
      amount: -4.75,
      category: 'Food',
      icon: <FaShoppingCart className="text-red-400" />,
    },
  ];

  const spendingCategories = [
    { name: 'Housing', amount: 1200, percentage: 35, color: 'bg-blue-500' },
    { name: 'Food', amount: 650, percentage: 19, color: 'bg-green-500' },
    { name: 'Transport', amount: 320, percentage: 9, color: 'bg-yellow-500' },
    { name: 'Shopping', amount: 480, percentage: 14, color: 'bg-red-500' },
    { name: 'Entertainment', amount: 250, percentage: 7, color: 'bg-purple-500' },
    { name: 'Others', amount: 350, percentage: 16, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaChartLine className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-800">FinanceDash</h1>
            </div>
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FaBell className="text-gray-500 hover:text-gray-700" size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 rounded-full p-1">
                <FaUserCircle className="text-gray-600" size={32} />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stat.amount}</p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <FaArrowUp className="text-green-500 mr-1" size={12} />
                    ) : (
                      <FaArrowDown className="text-red-500 mr-1" size={12} />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Transactions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Overview Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Spending Overview</h2>
              <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="space-y-4">
              {spendingCategories.map((category, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{category.name}</span>
                    <span className="text-gray-800 font-medium">${category.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Spent</span>
                <span className="text-xl font-bold text-gray-800">$3,250.00</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">{transaction.icon}</div>
                    <div>
                      <p className="font-medium text-gray-800">{transaction.name}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 text-right">{transaction.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Credit Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <FaMoneyBillWave className="text-blue-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">Send Money</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                <FaCreditCard className="text-green-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">Add Card</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <FaReceipt className="text-purple-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">Pay Bills</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
                <FaChartLine className="text-yellow-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">Invest</span>
              </button>
            </div>
          </div>

          {/* Credit Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-sm p-6 text-white lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-blue-200 text-sm">Current Balance</p>
                <p className="text-3xl font-bold mt-1">$24,560.00</p>
              </div>
              <FaCreditCard size={32} className="text-blue-300" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-200 text-sm">Card Number</p>
                <p className="font-mono text-lg tracking-wider">**** **** **** 4521</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Valid Thru</p>
                <p className="font-mono">08/28</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Card Holder</p>
                <p className="font-medium">JOHN DOE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Additional Info */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2025 FinanceDash. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700">
                Help
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}