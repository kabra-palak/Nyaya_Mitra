import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚖</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nyaya Mitra</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm px-5 py-2.5 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-sm px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-8 py-20">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            🚀 Introducing Your Legal Intelligence Partner
          </div>
          <h2 className="text-6xl font-bold text-slate-900 leading-tight">
            Access Legal Expertise,<br />Instantly
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Chat with legal documents, connect with verified lawyers, generate forms, and get AI-powered legal guidance — all for India's legal system.
          </p>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-3xl font-bold text-slate-900 mb-4">Everything You Need</h3>
          <p className="text-center text-slate-600 text-lg mb-12 max-w-2xl mx-auto">Powerful tools designed for India's legal professionals and individuals</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📄', title: 'Legal Desk', desc: 'Upload and chat with legal documents in real-time' },
              { icon: '💬', title: 'Legal Chat', desc: 'Ask questions in your language and get instant answers' },
              { icon: '⚖️', title: 'Find Lawyers', desc: 'Connect with verified legal professionals instantly' },
              { icon: '📝', title: 'Form Assistant', desc: 'Generate legal forms with AI guidance' },
            ].map(f => (
              <div key={f.title} className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h4>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-200 bg-white text-sm text-slate-500">
        <p>© 2026 Nyaya Mitra. For informational purposes only. Not a substitute for proper legal advice.</p>
      </footer>
    </div>
  )
}