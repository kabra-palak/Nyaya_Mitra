export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Welcome to Nyaya Mitra</h1>
        <p className="text-slate-600 text-lg mt-2">Your AI-powered legal intelligence platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/dashboard/legal-desk" className="group p-8 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">📄</span>
            <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">Legal Desk</h2>
          <p className="text-slate-600 mt-2">Upload and chat with your legal documents instantly powered by AI</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-600">Get started →</span>
          </div>
        </a>
        
        <a href="/dashboard/chat" className="group p-8 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">💬</span>
            <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">Legal Chat</h2>
          <p className="text-slate-600 mt-2">Ask any legal question in your language and get AI-powered answers</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-600">Get started →</span>
          </div>
        </a>

        <a href="/dashboard/lawyers" className="group p-8 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">⚖️</span>
            <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">Find Lawyers</h2>
          <p className="text-slate-600 mt-2">Connect directly with verified legal professionals in your area</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-600">Get started →</span>
          </div>
        </a>

        <a href="/dashboard/forms" className="group p-8 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">📝</span>
            <span className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">Form Assistant</h2>
          <p className="text-slate-600 mt-2">Generate legal forms with guidance and ensure compliance with Indian law</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm font-medium text-slate-600">Get started →</span>
          </div>
        </a>
      </div>
    </div>
  )
}