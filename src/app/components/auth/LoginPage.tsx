import { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle2, TrendingUp, Clock, Award } from "lucide-react";
import type { Role } from "../../data/mockData";
import { IsserLogo } from "../ui/IsserLogo";

const roleColors: Record<Role, string> = {
  'Admin': 'var(--primary)',
  'Researcher': '#2D6EA8',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

const demoAccounts: { role: Role; email: string; hint: string }[] = [
  { role: 'Admin', email: 'sarah.ahmad@iser.edu', hint: 'System administrator' },
  { role: 'Researcher', email: 'james.okonkwo@iser.edu', hint: 'Principal Investigator' },
  { role: 'Assistant Researcher', email: 'chen.wei@iser.edu', hint: 'Research assistant' },
  { role: 'Finance Officer', email: 'fatima.rashid@iser.edu', hint: 'Finance & Accounts' },
];

// Research-themed Unsplash photos
const PHOTOS = [
  'https://images.unsplash.com/photo-1532094349884-32d803a5d0a8?w=600&h=500&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1576086213369-e9a2ca5b5df2?w=600&h=500&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop&auto=format&q=70',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b6f4a?w=600&h=500&fit=crop&auto=format&q=70',
];

const GLASS = {
  background: 'rgba(255,255,255,0.10)',
  border: '1px solid rgba(255,255,255,0.18)',
  backdropFilter: 'blur(14px)',
  borderRadius: 16,
};

const GLASS_CARD_TEXT = { color: 'rgba(255,255,255,0.95)' };
const GLASS_SUB = { color: 'rgba(255,255,255,0.6)' };

interface LoginPageProps {
  onLogin: (role: Role) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    const account = demoAccounts.find(a => a.email === email);
    if (!account) { setError('No account found with this email.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    setLoading(true);
    setError('');
    setTimeout(() => { setLoading(false); onLogin(account.role); }, 900);
  };

  const quickLogin = (role: Role) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 600);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <style>{`
        @keyframes float-a {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes float-c {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-20px) rotate(1.5deg); }
        }
        @keyframes float-d {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50%       { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes drift-in {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes photo-zoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }
        .card-a { animation: float-a 5s ease-in-out infinite; }
        .card-b { animation: float-b 6s ease-in-out infinite 0.8s; }
        .card-c { animation: float-c 7s ease-in-out infinite 1.6s; }
        .card-d { animation: float-d 5.5s ease-in-out infinite 0.4s; }
        .drift-in-1 { animation: drift-in 0.6s ease-out 0.1s both; }
        .drift-in-2 { animation: drift-in 0.6s ease-out 0.3s both; }
        .drift-in-3 { animation: drift-in 0.6s ease-out 0.5s both; }
        .drift-in-4 { animation: drift-in 0.6s ease-out 0.7s both; }
        .photo-zoom  { animation: photo-zoom 1.2s ease-out both; }
      `}</style>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">

        {/* Layer 1 — photo mosaic */}
        <div className="absolute inset-0 grid grid-cols-2" style={{ gap: 3 }}>
          {PHOTOS.map((src, i) => (
            <div key={i} className="overflow-hidden relative">
              <img
                src={src}
                alt=""
                className="photo-zoom w-full h-full object-cover"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            </div>
          ))}
        </div>

        {/* Layer 2 — blue brand overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(26,51,99,0.92) 0%, rgba(18,40,80,0.88) 50%, rgba(26,51,99,0.94) 100%)',
        }} />

        {/* Layer 3 — subtle grid on top of overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" />
        </svg>

        {/* Layer 4 — content */}

        {/* Top: logo + headline */}
        <div className="relative">
          <div className="flex items-center mb-10">
            <IsserLogo height={52} white />
          </div>
          <h1 className="font-black text-[34px] text-white leading-snug mb-3">
            Manage your<br />research grants<br /><span style={{ color: '#B79A64' }}>with precision.</span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-[360px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            A unified platform for the complete research grant lifecycle — from application to final reports.
          </p>
        </div>

        {/* Middle: floating UI preview cards */}
        <div className="relative flex-1 my-8" style={{ minHeight: 220 }}>

          {/* Card 1 — Proposal approved (top-left) */}
          <div className="card-a drift-in-1 absolute" style={{ ...GLASS, top: 0, left: 0, padding: '14px 16px', width: 230 }}>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 28, height: 28, background: 'rgba(34,197,94,0.25)' }}>
                <CheckCircle2 size={14} style={{ color: '#4ADE80' }} />
              </div>
              <div>
                <div className="font-bold text-xs" style={GLASS_CARD_TEXT}>Proposal Approved</div>
                <div className="text-[10px]" style={GLASS_SUB}>Just now</div>
              </div>
            </div>
            <div className="text-[11px] font-medium mb-2" style={GLASS_SUB}>Coastal Erosion Monitoring</div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs" style={{ color: '#4ADE80' }}>GHS 180,000</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ADE80' }}>Funded</span>
            </div>
          </div>

          {/* Card 2 — Disbursement progress (right side) */}
          <div className="card-b drift-in-2 absolute" style={{ ...GLASS, top: 16, right: 0, padding: '14px 16px', width: 210 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: 'rgba(183,154,100,0.3)' }}>
                <TrendingUp size={13} style={{ color: '#F0C674' }} />
              </div>
              <span className="font-bold text-xs" style={GLASS_CARD_TEXT}>Disbursement</span>
            </div>
            <div className="text-[11px] mb-1.5" style={GLASS_SUB}>Nanoparticle Research</div>
            <div className="rounded-full overflow-hidden mb-1.5" style={{ height: 5, background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full" style={{ width: '65%', background: 'linear-gradient(to right, #60A5FA, #93C5FD)' }} />
            </div>
            <div className="flex justify-between">
              <span className="text-[10px]" style={GLASS_SUB}>65% released</span>
              <span className="font-mono text-[10px] font-bold" style={GLASS_CARD_TEXT}>GHS 292k</span>
            </div>
          </div>

          {/* Card 3 — Milestone (bottom-left) */}
          <div className="card-c drift-in-3 absolute" style={{ ...GLASS, bottom: 0, left: 20, padding: '14px 16px', width: 200 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 26, height: 26, background: 'rgba(251,146,60,0.25)' }}>
                <Clock size={13} style={{ color: '#FB923C' }} />
              </div>
              <span className="font-bold text-xs" style={GLASS_CARD_TEXT}>Milestone Due</span>
            </div>
            <div className="text-[11px] font-medium mb-1" style={GLASS_CARD_TEXT}>Q2 Progress Report</div>
            <div className="text-[10px]" style={GLASS_SUB}>Predictive Diagnostics</div>
            <div className="flex items-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#FB923C' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#FB923C' }}>3 days remaining</span>
            </div>
          </div>

          {/* Card 4 — Approval rate (bottom-right) */}
          <div className="card-d drift-in-4 absolute" style={{ ...GLASS, bottom: 10, right: 10, padding: '12px 16px', width: 160 }}>
            <div className="flex items-center gap-2 mb-1">
              <Award size={13} style={{ color: '#F0C674' }} />
              <span className="text-[10px] font-semibold" style={GLASS_SUB}>Approval Rate</span>
            </div>
            <div className="font-black text-[28px] leading-none" style={{ color: '#F0C674' }}>94%</div>
            <div className="flex items-center gap-1 mt-1.5">
              <svg width="40" height="16" viewBox="0 0 40 16">
                <polyline points="0,14 8,10 16,12 24,6 32,8 40,2" fill="none" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[9px]" style={{ color: '#4ADE80' }}>↑ 4% this year</span>
            </div>
          </div>
        </div>

        {/* Bottom: stats */}
        <div className="relative space-y-2">
          {[
            { stat: '247', label: 'Research Projects Funded' },
            { stat: 'GHS 12.4M', label: 'Total Grants Awarded' },
            { stat: '94%', label: 'Researcher Satisfaction' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="font-black text-[20px] min-w-[72px]" style={{ color: '#B79A64' }}>{item.stat}</span>
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (login form) ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8 lg:hidden">
            <IsserLogo height={38} />
          </div>

          <div className="mb-8">
            <h2 className="font-extrabold text-[26px] text-foreground leading-snug mb-1.5">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">Enter your institutional email and password</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[13px] text-foreground mb-2">Email Address</label>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@iser.edu"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-card text-sm text-foreground"
                style={{ border: `1px solid ${error ? '#EF4444' : 'var(--border)'}` }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label className="block font-semibold text-[13px] text-foreground mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all pr-12 bg-card text-sm text-foreground"
                  style={{ border: `1px solid ${error ? '#EF4444' : 'var(--border)'}` }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-[13px]" style={{ color: '#EF4444' }}>{error}</p>}
            <button
              onClick={handleLogin} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all font-bold text-sm"
              style={{ background: loading ? '#90A8C4' : 'var(--primary)', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
            <div className="text-center">
              <button className="text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity">Forgot password?</button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or quick demo access</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.role} onClick={() => quickLogin(acc.role)} disabled={loading}
                className="p-3 rounded-xl text-left transition-all border border-border bg-card hover:shadow-sm"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = roleColors[acc.role] === 'var(--primary)' ? 'var(--primary)' : roleColors[acc.role]; (e.currentTarget as HTMLElement).style.background = (roleColors[acc.role] === 'var(--primary)' ? '#1A3363' : roleColors[acc.role]) + '10'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--card)'; }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full inline-block w-2 h-2" style={{ background: roleColors[acc.role] }} />
                  <span className="font-bold text-xs text-foreground">{acc.role}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{acc.hint}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
