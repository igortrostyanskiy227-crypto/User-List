import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'
import { MOCK_USERS } from './data/mockUsers'
import { type User } from './types'
import { SearchBar } from './components/SearchBar'
import { UserRow } from './components/UserRow'
import { UserDetail } from './components/UserDetail'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_USERS
    return MOCK_USERS.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone?.includes(q)
    )
  }, [query])

  const selectedUser: User | null = MOCK_USERS.find(u => u.id === selectedId) ?? null

  function handleSelect(id: string) {
    setSelectedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header
        className="shrink-0 px-6 h-14 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--primary-dim)', color: 'var(--primary)' }}
          >
            <Users size={14} />
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Реестр пользователей
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-md font-mono"
          style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          ВНебо
        </span>
      </header>

      {/* Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: user list */}
        <div
          className="flex flex-col min-h-0 shrink-0 transition-all duration-300"
          style={{
            width: selectedUser ? '420px' : '100%',
            borderRight: '1px solid var(--border)',
          }}
        >
          {/* Search */}
          <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              resultCount={filtered.length}
              totalCount={MOCK_USERS.length}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 gap-2"
                >
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Пользователи не найдены
                  </p>
                </motion.div>
              ) : (
                <motion.div key="list" className="flex flex-col gap-0.5">
                  {filtered.map((user, i) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      selected={selectedId === user.id}
                      onClick={() => handleSelect(user.id)}
                      index={i}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: detail panel */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 380 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 min-h-0 overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <UserDetail user={selectedUser} onClose={() => setSelectedId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
