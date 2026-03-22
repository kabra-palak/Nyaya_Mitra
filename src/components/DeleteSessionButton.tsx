'use client'

interface Props {
  sessionId: string
  onDelete: (sessionId: string) => void
}

export default function DeleteSessionButton({ sessionId, onDelete }: Props) {
  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Delete this chat session?')) return
    onDelete(sessionId)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-400 hover:text-red-600 px-1"
    >
      ✕
    </button>
  )
}