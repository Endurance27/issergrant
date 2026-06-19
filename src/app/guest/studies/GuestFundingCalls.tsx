import { useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'

// Guest sees only assigned funding calls — fetched via myFundingCalls query
// For now use a placeholder empty state since backend integration comes later
export function GuestFundingCalls() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <PageHeader
        title="My Funding Calls"
        subtitle="Funding calls you have been assigned to"
      />

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-5 bg-card border border-border focus-within:border-primary/50 transition-colors">
        <Search size={15} className="text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search assigned funding calls..."
          className="bg-transparent outline-none flex-1 text-[13px] text-foreground"
        />
      </div>

      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border text-muted-foreground">
        <Search size={24} className="mb-3 opacity-40" />
        <div className="font-semibold text-sm">No assigned funding calls</div>
        <div className="text-xs mt-1">Your researcher will assign funding calls to you</div>
      </div>
    </div>
  )
}
