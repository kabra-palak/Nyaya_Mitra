import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <h1 className="text-xl font-bold">Nyaya Mitra</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm px-4 py-2 rounded hover:bg-slate-100">
            Login
          </Link>
          <Link href="/signup" className="text-sm px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-700">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6">
        <h2 className="text-5xl font-bold max-w-2xl leading-tight">
          Your AI-Powered Legal Intelligence Platform
        </h2>
        <p className="text-slate-500 text-lg max-w-xl">
          Chat with legal documents, find verified lawyers, generate legal forms, and get instant legal guidance — all in one place.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700">
            Get Started Free
          </Link>
          <Link href="/login" className="px-6 py-3 border rounded-lg hover:bg-slate-50">
            Login
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8 py-16 border-t">
        {[
          { icon: '📄', title: 'Legal Desk', desc: 'Upload and chat with legal documents' },
          { icon: '💬', title: 'Legal Chat', desc: 'Ask any legal question in your language' },
          { icon: '⚖️', title: 'Find Lawyers', desc: 'Connect with verified legal professionals' },
          { icon: '📝', title: 'Form Assistant', desc: 'Generate legal forms instantly' },
        ].map(f => (
          <div key={f.title} className="space-y-2 text-center">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t text-sm text-slate-400">
        © 2026 Nyaya Mitra. For informational purposes only. Not a substitute for legal advice.
      </footer>
    </div>
  )
}