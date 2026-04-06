// app/page.js
"use client";

import Link from 'next/link';
import {
  FiPlus,
  FiMinus,
  FiTrendingUp,
  FiTarget,
  FiClock,
  FiCreditCard,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiPlay,
  FiUser,
  FiBarChart2,
  FiHome,
  FiDollarSign,
  FiSmartphone,
  FiShield,
  FiLogIn,
  FiMenu
} from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { isDark, mounted } = useTheme();

  // Features focused on BASIC expense management
  const features = [
    {
      icon: <FiPlus className="text-emerald-500" size={24} />,
      title: "Quick Expense Logging",
      description: "Add expenses in seconds — just type amount, category, and notes. No complicated forms."
    },
    {
      icon: <FiMinus className="text-rose-500" size={24} />,
      title: "Income Tracking",
      description: "Record your income sources and see exactly how much you have left after expenses."
    },
    {
      icon: <FiBarChart2 className="text-blue-500" size={24} />,
      title: "Simple Reports",
      description: "View weekly & monthly summaries. Know where your money goes at a glance."
    },
    {
      icon: <FiTarget className="text-amber-500" size={24} />,
      title: "Savings Goals",
      description: "Set basic saving targets and track progress without complexity."
    },
    {
      icon: <FiClock className="text-indigo-500" size={24} />,
      title: "Recurring Expenses",
      description: "Handle bills & subscriptions with easy repeat entries — never miss a due date."
    },
    {
      icon: <FiCreditCard className="text-teal-500" size={24} />,
      title: "Cash Balance",
      description: "Manual cash & bank balance tracking — perfect for beginners."
    }
  ];

  // How it works steps
  const steps = [
    {
      step: "01",
      title: "Add your income",
      desc: "Start by entering your monthly salary or any earnings."
    },
    {
      step: "02",
      title: "Log expenses",
      desc: "Whenever you spend, quickly add it with a category."
    },
    {
      step: "03",
      title: "See insights",
      desc: "View leftover money, spending trends, and stay on budget."
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Freelance Designer",
      content: "Finally an expense tracker that doesn't overwhelm me. I actually log my coffee expenses now!",
      rating: 5
    },
    {
      name: "Rahul Mehta",
      role: "College Student",
      content: "Super basic but exactly what I needed. I can see where my pocket money goes every month.",
      rating: 5
    },
    {
      name: "Anjali Nair",
      role: "Small Business Owner",
      content: "Tracking business expenses used to be a headache. This makes it dead simple.",
      rating: 5
    }
  ];

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
        : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50/30'
      }`}>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-md z-50 border-b transition-colors duration-300 ${isDark
          ? 'bg-black/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
        }`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-xl shadow-sm">
              <FiCreditCard className="text-white" size={18} />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'
              }`}>Xpenso</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#features" className={`transition ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
              }`}>Features</a>
            <a href="#how-it-works" className={`transition ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
              }`}>How it works</a>
            <a href="#testimonials" className={`transition ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
              }`}>Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`hidden sm:block text-sm font-medium transition ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Log in</Link>
            <Link href="/register" className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition shadow-sm">
              Sign up free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-5">
        <div className="max-w-5xl mx-auto text-center">
          <div className={`inline-flex items-center rounded-full px-3 py-1 mb-5 ${isDark ? 'bg-emerald-900/50' : 'bg-emerald-100'
            }`}>
            <span className={`text-xs font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'
              }`}>✨ Simple. Fast. Free.</span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-extrabold leading-tight mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Master your money with{' '}
            <span className="text-emerald-500 bg-gradient-to-r from-emerald-100 to-emerald-50 px-2 rounded-2xl">basic expense</span>{' '}
            tracking
          </h1>
          <p className={`text-lg max-w-2xl mx-auto mb-8 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            No complicated spreadsheets. No confusing reports. Just a clean way to log expenses, track income, and save more.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/register" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition shadow-md flex items-center justify-center gap-2">
              Start tracking for free <FiArrowRight size={16} />
            </Link>
            <button className={`border px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${isDark
                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
              <FiPlay size={14} /> Watch 1-min demo
            </button>
          </div>

          {/* Mini stats */}
          <div className={`flex flex-wrap justify-center gap-6 text-sm pt-8 max-w-lg mx-auto border-t transition-colors duration-300 ${isDark ? 'text-gray-500 border-gray-800' : 'text-gray-500 border-gray-200'
            }`}>
            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> 5,000+ users</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> 4.8 ⭐ rating</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Totally free</div>
          </div>

          {/* Dashboard preview mockup */}
          <div className={`mt-12 max-w-3xl mx-auto rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
            <div className={`px-4 py-2 flex items-center gap-2 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>expenseease.app/dashboard</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'
                    }`}>This month</p>
                  <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-800'
                    }`}>₹42,850 <span className={`text-sm font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>remaining</span></p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  }`}>On track ✅</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Food & dining</span>
                  <span className={isDark ? 'text-gray-300 font-medium' : 'font-medium'}>₹4,250 / ₹6,000</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}><div className="bg-emerald-400 h-2 rounded-full w-3/4"></div></div>
                <div className="flex justify-between text-sm mt-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shopping</span>
                  <span className={isDark ? 'text-gray-300 font-medium' : 'font-medium'}>₹2,100 / ₹3,000</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}><div className="bg-amber-400 h-2 rounded-full w-2/3"></div></div>
                <div className="flex justify-between text-sm mt-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Transport</span>
                  <span className={isDark ? 'text-gray-300 font-medium' : 'font-medium'}>₹850 / ₹1,500</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}><div className="bg-blue-400 h-2 rounded-full w-1/2"></div></div>
              </div>
              <div className={`mt-5 pt-3 border-t flex justify-between text-xs ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'
                }`}>
                <span className="flex items-center gap-1"><FiPlus size={12} /> Quick add expense</span>
                <span className="flex items-center gap-1"><FiBarChart2 size={12} /> View reports →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className={`py-16 px-5 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>Designed for simplicity</h2>
            <p className={`max-w-xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Everything you need to manage daily expenses — and nothing you don't.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className={`rounded-2xl p-5 border transition-all duration-300 hover:shadow-md ${isDark
                  ? 'bg-gray-900 border-gray-800 hover:border-emerald-800'
                  : 'bg-gray-50/50 border-gray-100 hover:border-emerald-200'
                }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'
                  }`}>
                  {feat.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-1 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>{feat.title}</h3>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={`py-16 px-5 transition-colors duration-300 ${isDark ? 'bg-gray-900/50' : 'bg-emerald-50/40'
        }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>Get started in 3 simple steps</h2>
            <p className={`mt-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>No learning curve, just start tracking.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className={`rounded-2xl p-6 shadow-sm text-center border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                }`}>
                <span className={`text-4xl font-black ${isDark ? 'text-emerald-900' : 'text-emerald-200'
                  }`}>{step.step}</span>
                <h3 className={`text-xl font-semibold mt-2 mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>{step.title}</h3>
                <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/register" className={`inline-flex items-center gap-2 font-semibold transition-all hover:gap-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
              Start tracking now <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`py-16 px-5 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'
        }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>Loved by people who keep it simple</h2>
            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Join thousands managing expenses without stress.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`rounded-2xl p-5 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'
                }`}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="text-amber-400 fill-amber-400 text-sm" />)}
                </div>
                <p className={`text-sm mb-4 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>"{t.content}"</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-200 text-emerald-700'
                    }`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-900'
                      }`}>{t.name}</p>
                    <p className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free plan section */}
      <section className={`py-16 px-5 transition-colors duration-300 ${isDark ? 'bg-gray-900/50' : 'bg-emerald-50/30'
        }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl shadow-sm border p-8 md:p-10 transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
              }`}>Simple, transparent & free</h2>
            <p className={`mb-6 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>No premium tiers, no hidden costs. Just basic expense management that works.</p>
            <div className="flex justify-center gap-2 items-baseline">
              <span className={`text-5xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'
                }`}>₹0</span>
              <span className={`transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>forever</span>
            </div>
            <ul className="mt-6 space-y-2 text-left max-w-xs mx-auto">
              <li className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}><FiCheckCircle className="text-emerald-500 text-sm" /> Unlimited expenses</li>
              <li className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}><FiCheckCircle className="text-emerald-500 text-sm" /> Monthly & weekly reports</li>
              <li className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}><FiCheckCircle className="text-emerald-500 text-sm" /> Export to CSV</li>
              <li className={`flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}><FiCheckCircle className="text-emerald-500 text-sm" /> No credit card needed</li>
            </ul>
            <div className="mt-8">
              <Link href="/register" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition inline-flex items-center gap-2 shadow-md">
                Start managing expenses <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`transition-colors duration-300 py-10 px-5 ${isDark ? 'bg-black text-gray-500' : 'bg-gray-900 text-gray-400'
        }`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-500 p-1 rounded-lg"><FiCreditCard className="text-white" size={16} /></div>
                <span className={`font-bold text-lg transition-colors duration-300 ${isDark ? 'text-white' : 'text-white'
                  }`}>Xpenso</span>
              </div>
              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-500'
                }`}>The simplest way to track expenses & stay on top of your money.</p>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-white'
                }`}>Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>Features</a></li>
                <li><a href="#how-it-works" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>How it works</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-white'
                }`}>Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>FAQ</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>Contact</a></li>
                <li><a href="#" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-white'
                  }`}>Blog</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t pt-6 text-center text-xs ${isDark ? 'border-gray-800 text-gray-600' : 'border-gray-800 text-gray-600'
            }`}>
            © 2026 Xpenso — Basic expense management for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
}