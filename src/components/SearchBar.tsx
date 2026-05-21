import { Search, X } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
  resultCount: number
  totalCount: number
}

export function SearchBar({ value, onChange, resultCount, totalCount }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Имя или email..."
          className="w-full pl-9 pr-8 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = 'var(--border-hover)'
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 transition-opacity opacity-60 hover:opacity-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={12} />
          </button>
        )}
      </div>
      <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
        {value ? `${resultCount} из ${totalCount}` : `${totalCount} пользователей`}
      </span>
    </div>
  )
}
