import { useState, useRef } from "react";
import { Bell, Shield, User, Palette, Globe, Save } from "lucide-react";
import type { Role } from "../../data/mockData";
import { currentUsers } from "../../data/mockData";
import { useToast } from "../ui/Toast";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { PageHeader } from "../ui/PageHeader";

interface SettingsProps { role: Role; darkMode: boolean; onToggleDark: () => void; }

export function Settings({ role, darkMode, onToggleDark }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const user = currentUsers[role];
  const [notifPrefs, setNotifPrefs] = useState({ email: true, inApp: true, deadlines: true, approvals: true, payments: true, system: false });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const save = (msg: string = 'Changes saved successfully') => toast(msg);

  const handleUpdatePassword = () => {
    if (!currentPw) { toast('Enter your current password', 'error'); return; }
    if (newPw.length < 8) { toast('New password must be at least 8 characters', 'error'); return; }
    if (newPw !== confirmPw) { toast('Passwords do not match', 'error'); return; }
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    toast('Password updated successfully');
  };

  const handleToggle2FA = () => {
    setTwoFAEnabled(v => !v);
    toast(twoFAEnabled ? '2FA disabled' : '2FA enabled successfully', twoFAEnabled ? 'warning' : 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={15} /> },
    { id: 'security', label: 'Security', icon: <Shield size={15} /> },
  ];
  if (role === 'Admin') tabs.push({ id: 'system', label: 'System', icon: <Globe size={15} /> });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences and system configuration" />

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-52 flex-shrink-0">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-[13px] ${activeTab === tab.id ? 'bg-secondary text-primary font-bold' : 'text-muted-foreground font-medium hover:bg-muted'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="rounded-2xl p-6 bg-card border border-border">
              <h3 className="font-bold text-base text-foreground mb-5">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted">
                <div className="flex items-center justify-center rounded-full text-white font-extrabold text-[22px]" style={{ width: 64, height: 64, background: 'var(--primary)' }}>{user.avatar}</div>
                <div>
                  <div className="font-extrabold text-base text-foreground">{user.name}</div>
                  <div className="text-[13px] text-muted-foreground">{user.role} · {user.department}</div>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={() => toast('Photo updated', 'success')} />
                  <button onClick={() => photoInputRef.current?.click()} className="mt-2 px-3 py-1 rounded-xl text-xs font-semibold text-primary border border-border hover:bg-muted transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: user.name },
                  { label: 'Email Address', value: user.email },
                  { label: 'Role', value: user.role, readonly: true },
                  { label: 'Department', value: user.department },
                  { label: 'Member Since', value: user.joined, readonly: true },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input type="text" defaultValue={field.value} readOnly={field.readonly} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px]" style={{ color: field.readonly ? 'var(--muted-foreground)' : 'var(--foreground)', cursor: field.readonly ? 'not-allowed' : 'text' }} />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button onClick={() => save('Profile saved')} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-2xl p-6 bg-card border border-border">
              <h3 className="font-bold text-base text-foreground mb-5">Notification Preferences</h3>
              <div className="space-y-1">
                {[
                  { key: 'email', label: 'Email Notifications', sub: 'Receive important updates via email' },
                  { key: 'inApp', label: 'In-App Notifications', sub: 'Show notifications in the portal' },
                  { key: 'deadlines', label: 'Deadline Reminders', sub: 'Get reminded about upcoming grant and milestone deadlines' },
                  { key: 'approvals', label: 'Approval Updates', sub: 'Notifications when proposals or reports are approved or rejected' },
                  { key: 'payments', label: 'Payment Alerts', sub: 'Alerts when disbursements are processed or pending' },
                  { key: 'system', label: 'System Announcements', sub: 'Platform maintenance and system-wide updates' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <div className="font-semibold text-[13px] text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                    </div>
                    <button
                      onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className="rounded-full transition-all duration-200 flex-shrink-0 relative"
                      style={{ width: 44, height: 24, background: notifPrefs[item.key as keyof typeof notifPrefs] ? 'var(--primary)' : 'var(--border)' }}
                    >
                      <span className="absolute top-1 rounded-full transition-all duration-200 bg-white" style={{ width: 16, height: 16, left: notifPrefs[item.key as keyof typeof notifPrefs] ? 24 : 4 }} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button onClick={() => save('Notification preferences saved')} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="rounded-2xl p-6 bg-card border border-border">
              <h3 className="font-bold text-base text-foreground mb-5">Appearance</h3>
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-foreground mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  {[{ label: 'Light', val: false }, { label: 'Dark', val: true }].map(opt => (
                    <button key={opt.label} onClick={() => { if (darkMode !== opt.val) { onToggleDark(); toast(`${opt.label} mode enabled`, 'info'); } }}
                      className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all"
                      style={{ border: `2px solid ${darkMode === opt.val ? 'var(--primary)' : 'var(--border)'}`, background: darkMode === opt.val ? 'var(--secondary)' : 'var(--muted)' }}>
                      <div className="w-full h-10 rounded-lg border border-border" style={{ background: opt.val ? '#0F172A' : '#F8FAFC' }} />
                      <span className="font-bold text-[13px]" style={{ color: darkMode === opt.val ? 'var(--primary)' : 'var(--foreground)' }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-foreground mb-3">Language</label>
                <select onChange={() => toast('Language updated', 'info')} className="px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
                  <option>English (United States)</option>
                  <option>Bahasa Malaysia</option>
                  <option>العربية</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-card border border-border">
                <h3 className="font-bold text-base text-foreground mb-4">Change Password</h3>
                <div className="space-y-3 max-w-sm">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Current Password</label>
                    <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">New Password</label>
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
                  </div>
                  <button onClick={handleUpdatePassword} className="btn-primary mt-2">Update Password</button>
                </div>
              </div>
              <div className="rounded-2xl p-6 bg-card border border-border">
                <h3 className="font-bold text-sm text-foreground mb-1">Two-Factor Authentication</h3>
                <p className="text-[13px] text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border">
                  <div>
                    <div className="font-semibold text-[13px] text-foreground">Authenticator App</div>
                    <div className="text-xs text-muted-foreground">{twoFAEnabled ? 'Configured and active' : 'Not configured'}</div>
                  </div>
                  <button onClick={handleToggle2FA} className={twoFAEnabled ? 'btn-destructive text-xs' : 'btn-primary text-xs'}>
                    {twoFAEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && role === 'Admin' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-card border border-border">
                <h3 className="font-bold text-base text-foreground mb-4">System Configuration</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Institution Name', value: 'Institute for Science and Engineering Research (ISER)' },
                    { label: 'Portal URL', value: 'https://portal.iser.edu.my' },
                    { label: 'System Email', value: 'noreply@iser.edu.my' },
                    { label: 'Max File Upload Size', value: '50 MB' },
                  ].map(item => (
                    <div key={item.label}>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">{item.label}</label>
                      <input type="text" defaultValue={item.value} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button onClick={() => save('System settings saved')} className="btn-primary flex items-center gap-2">
                    <Save size={14} /> Save System Settings
                  </button>
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#991B1B' }}>Danger Zone</h3>
                <p className="text-[13px] mb-3" style={{ color: '#B91C1C' }}>Irreversible and destructive actions.</p>
                <button onClick={() => setShowResetConfirm(true)} className="btn-destructive">Reset All System Data</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset All System Data"
        message="This will permanently delete all proposals, awards, and reports. This action cannot be undone."
        confirmLabel="Reset Everything"
        confirmColor="#EF4444"
        onConfirm={() => { setShowResetConfirm(false); toast('System data reset', 'error'); }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
