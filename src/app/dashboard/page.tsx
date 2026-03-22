export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Nyaya Mitra</h1>
      <p className="text-slate-500">Your AI-powered legal intelligence platform.</p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <a href="/dashboard/legal-desk" className="p-6 border rounded-lg hover:bg-slate-50">
          <h2 className="text-lg font-semibold">📄 Legal Desk</h2>
          <p className="text-sm text-slate-500 mt-1">Upload and chat with legal documents</p>
        </a>
        <a href="/dashboard/chat" className="p-6 border rounded-lg hover:bg-slate-50">
          <h2 className="text-lg font-semibold">💬 Legal Chat</h2>
          <p className="text-sm text-slate-500 mt-1">Ask any legal question in your language</p>
        </a>
        <a href="/dashboard/lawyers" className="p-6 border rounded-lg hover:bg-slate-50">
          <h2 className="text-lg font-semibold">⚖️ Find Lawyers</h2>
          <p className="text-sm text-slate-500 mt-1">Connect with verified legal professionals</p>
        </a>
        <a href="/dashboard/forms" className="p-6 border rounded-lg hover:bg-slate-50">
          <h2 className="text-lg font-semibold">📝 Form Assistant</h2>
          <p className="text-sm text-slate-500 mt-1">Get help filling legal forms</p>
        </a>
      </div>
    </div>
  )
}