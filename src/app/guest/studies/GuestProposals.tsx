import { useState } from 'react'
import { Search, FileText } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'

export function GuestProposals() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <PageHeader
        title="My Proposals"
        subtitle="Proposals associated with your assigned funding calls"
      />

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5 bg-card border border-border">
        <Search size={15} className="text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search proposals..."
          className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
        />
      </div>

      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground">
        <FileText size={24} className="mb-3 opacity-40" />
        <div className="font-semibold text-sm">No proposals to display</div>
        <div className="text-xs mt-1">Proposals linked to your assigned funding calls will appear here</div>
      </div>
    </div>
  )
}
