import { Link } from "react-router-dom";
import { FaWallet, FaPiggyBank, FaChartLine, FaReceipt, FaCoins } from "react-icons/fa";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Section 1: Hero */}
      <section className="relative flex-1 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-20 transition-colors duration-200">
        <h1 className="text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-4 animate-pulse text-center">
          Welcome to Finance Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg text-center mb-8">
          Track your income, expenses, and savings securely.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="w-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-16 transition-colors duration-200">
        <h2 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-12 text-center">Features of Finance Tracker</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="flex flex-col items-center text-center p-6 bg-indigo-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition transform">
            <FaWallet className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Track Expenses</h3>
            <p className="text-gray-600 dark:text-gray-300">Add and monitor your daily expenses easily with detailed categories.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-indigo-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition transform">
            <FaPiggyBank className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Save Money</h3>
            <p className="text-gray-600 dark:text-gray-300">Set savings goals and track progress over time to achieve financial stability.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-indigo-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition transform">
            <FaChartLine className="text-indigo-600 dark:text-indigo-400 text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Analyze Reports</h3>
            <p className="text-gray-600 dark:text-gray-300">Visual charts help you understand your spending patterns and improve budgeting.</p>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center px-4 py-16 transition-colors duration-200">
        <h2 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-12 text-center">How It Works</h2>
        <div className="max-w-4xl w-full">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">1. Sign Up & Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your account in under a minute. No credit card required. Start tracking your finances immediately.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554224155-3a58922a22c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="signup illustration"
                  className="w-full h-auto transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">2. Add Transactions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easily add your income and expenses. Categorize them for better organization and insights.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661443376225-20e07ceb7402?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="receipts illustration"
                  className="w-full h-auto transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">3. Gain Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                View detailed reports and analytics to understand your spending habits and make informed financial decisions.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="analytics illustration"
                  className="w-full h-auto transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="w-full bg-indigo-600 dark:bg-indigo-900 py-16 px-4 transition-colors duration-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to take control of your finances?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Join thousands of users who are already managing their money smarter with Finance Tracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              Get Started for Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
