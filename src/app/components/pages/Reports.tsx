import { useState, useRef, useEffect } from "react";
import { FileText, Download, Upload, Eye, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { PageHeader } from "../ui/PageHeader";
import { useToast } from "../ui/Toast";
import { supabase } from "../../../lib/supabase";
import type { Role } from "../../data/mockData";

interface Report {
  id: string;
  title: string;
  type: 'Progress Report' | 'Financial Report' | 'Technical Report' | 'Final Report';
  project: string;
  submittedBy: string;
  date: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  version: number;
  size: string;
}

const INITIAL_REPORTS: Report[] = [
  { id: 'RPT-001', title: 'Q1 2025 Progress Report — Nanoparticle Drug Delivery', type: 'Progress Report', project: 'AW-2025-002', submittedBy: 'Prof. James Okonkwo', date: '2025-04-10', status: 'Approved', version: 1, size: '2.4 MB' },
  { id: 'RPT-002', title: 'Financial Summary Q1 — Nanoparticle Drug Delivery', type: 'Financial Report', project: 'AW-2025-002', submittedBy: 'Prof. James Okonkwo', date: '2025-04-15', status: 'Approved', version: 1, size: '1.1 MB' },
  { id: 'RPT-003', title: 'Dataset Collection & Preprocessing Report', type: 'Technical Report', project: 'AW-2025-001', submittedBy: 'Dr. Layla Hassan', date: '2025-05-27', status: 'Under Review', version: 1, size: '3.8 MB' },
  { id: 'RPT-004', title: 'Sensor Deployment Technical Report', type: 'Technical Report', project: 'AW-2024-005', submittedBy: 'Dr. Layla Hassan', date: '2025-06-08', status: 'Approved', version: 2, size: '5.2 MB' },
  { id: 'RPT-005', title: 'Mid-Term Progress Report — Coastal Erosion', type: 'Progress Report', project: 'AW-2024-005', submittedBy: 'Dr. Layla Hassan', date: '2025-05-01', status: 'Submitted', version: 1, size: '2.9 MB' },
  { id: 'RPT-006', title: 'Bioreactor Final Completion Report', type: 'Final Report', project: 'AW-2024-003', submittedBy: 'Prof. James Okonkwo', date: '2025-04-01', status: 'Approved', version: 3, size: '7.1 MB' },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  'Progress Report':  { bg: 'var(--secondary)', text: 'var(--primary)' },
  'Financial Report': { bg: '#FFFBEB', text: '#B45309' },
  'Technical Report': { bg: '#F5F3FF', text: '#6D28D9' },
  'Final Report':     { bg: '#ECFDF5', text: '#065F46' },
};

interface ReportsProps { role: Role; }

export function Reports({ role }: ReportsProps) {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Report | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [confirmRevision, setConfirmRevision] = useState<Report | null>(null);
  const [uploadType, setUploadType] = useState('Progress Report');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadProject, setUploadProject] = useState('AW-2025-002 — Nanoparticle Drug Delivery');
  const [uploadNotes, setUploadNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; size: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch already-uploaded files from Supabase Storage
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const { data, error } = await supabase.storage.from('reports').list('', { limit: 50 });
      if (!error && data) {
        const files = data.map(f => ({
          name: f.name,
          size: f.metadata?.size ?? 0,
          url: supabase.storage.from('reports').getPublicUrl(f.name).data.publicUrl,
        }));
        setUploadedFiles(files);
      }
    };
    fetchUploadedFiles();
  }, []);

  const types = ['All', 'Progress Report', 'Financial Report', 'Technical Report', 'Final Report'];
  const filtered = reports.filter(r => filter === 'All' || r.type === filter);
  const pendingCount = reports.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length;

  const approveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: 'Approved' as const } : prev);
    toast('Report approved successfully');
  };

  const requestRevision = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: 'Rejected' as const } : prev);
    setConfirmRevision(null);
    toast('Revision requested', 'warning');
  };

  const handleDownload = (report: Report, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast(`Downloading ${report.id}...`, 'info');
  };

  const handleExportAll = () => toast('Exporting all reports...', 'info');

  const handleSubmitReport = async () => {
    if (!uploadTitle.trim()) { toast('Please enter a report title', 'error'); return; }
    setUploading(true);
    let fileSize = '—';
    if (selectedFile) {
      const filePath = `${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage.from('reports').upload(filePath, selectedFile, { upsert: false });
      if (uploadError) {
        toast(`Upload failed: ${uploadError.message}`, 'error');
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('reports').getPublicUrl(filePath);
      fileSize = `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`;
      setUploadedFiles(prev => [...prev, { name: filePath, size: selectedFile.size, url: urlData.publicUrl }]);
    }
    const newReport: Report = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      title: uploadTitle,
      type: uploadType as Report['type'],
      project: uploadProject.split(' — ')[0],
      submittedBy: 'You',
      date: new Date().toISOString().slice(0, 10),
      status: 'Submitted',
      version: 1,
      size: fileSize,
    };
    setReports(prev => [newReport, ...prev]);
    setShowUpload(false);
    setUploadTitle('');
    setUploadNotes('');
    setSelectedFile(null);
    setUploading(false);
    toast('Report submitted successfully');
  };

  return (
    <div>
      <PageHeader
        title="Reports & Documentation"
        subtitle={`${pendingCount} reports pending review`}
        action={
          <div className="flex gap-2">
            <button onClick={handleExportAll} className="btn-secondary flex items-center gap-2">
              <Download size={15} /> Export All
            </button>
            {(role === 'Researcher' || role === 'Assistant Researcher') && (
              <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
                <Upload size={15} /> Upload Report
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Reports', value: reports.length, color: 'var(--primary)', bg: 'var(--secondary)' },
          { label: 'Approved', value: reports.filter(r => r.status === 'Approved').length, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Under Review', value: reports.filter(r => r.status === 'Under Review' || r.status === 'Submitted').length, color: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Rejected', value: reports.filter(r => r.status === 'Rejected').length, color: '#EF4444', bg: '#FEF2F2' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl p-4 flex items-center gap-3 bg-card border border-border">
            <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: item.bg, color: item.color }}>
              <FileText size={16} />
            </div>
            <div>
              <div className="font-mono font-extrabold text-xl text-foreground leading-none">{item.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-xl transition-all text-xs border whitespace-nowrap ${filter === t ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(r => {
          const tc = typeColors[r.type];
          return (
            <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group bg-card border border-border" onClick={() => setSelected(r)}>
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 44, height: 44, background: tc.bg }}>
                <FileText size={20} style={{ color: tc.text }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px]" style={{ background: tc.bg, color: tc.text }}>{r.type}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
                  {r.version > 1 && <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary text-primary">v{r.version}</span>}
                </div>
                <div className="font-bold text-[13px] text-foreground truncate">{r.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{r.submittedBy} · {r.date} · {r.size}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge status={r.status} size="sm" />
                <button
                  title="Download"
                  onClick={e => handleDownload(r, e)}
                  className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Download size={15} />
                </button>
                <button
                  title="View details"
                  onClick={e => { e.stopPropagation(); setSelected(r); }}
                  className="flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Eye size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText size={24} className="opacity-40" />
            </div>
            <div className="font-semibold text-sm">No reports found</div>
            <div className="text-xs mt-1">Try changing the filter</div>
          </div>
        )}
      </div>

      {/* Uploaded files from Supabase Storage */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-sm text-foreground mb-3">Uploaded Files (Supabase Storage)</h3>
          <div className="space-y-2">
            {uploadedFiles.map(f => (
              <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <FileText size={16} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px] text-foreground truncate">{f.name}</div>
                  {f.size > 0 && <div className="text-[11px] text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</div>}
                </div>
                <a href={f.url} target="_blank" rel="noreferrer" className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5">
                  <Download size={12} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Report Details" width={580}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md font-semibold text-[11px]" style={{ background: typeColors[selected.type].bg, color: typeColors[selected.type].text }}>{selected.type}</span>
              <Badge status={selected.status} />
              {selected.version > 1 && <span className="font-mono text-[11px] text-primary">Version {selected.version}</span>}
            </div>
            <h2 className="font-extrabold text-base text-foreground leading-snug">{selected.title}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Report ID', value: selected.id },
                { label: 'Project', value: selected.project },
                { label: 'Submitted By', value: selected.submittedBy },
                { label: 'Submission Date', value: selected.date },
                { label: 'File Size', value: selected.size },
                { label: 'Version', value: `v${selected.version}` },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-muted">
                  <div className="text-[11px] text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-bold text-[13px] text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border">
              <FileText size={24} className="text-primary flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-[13px] text-foreground">{selected.id.toLowerCase()}_report.pdf</div>
                <div className="text-[11px] text-muted-foreground">{selected.size} · PDF Document</div>
              </div>
              <button onClick={() => handleDownload(selected)} className="btn-primary flex items-center gap-1.5 text-xs">
                <Download size={13} /> Download
              </button>
            </div>
            {role === 'Admin' && (selected.status === 'Under Review' || selected.status === 'Submitted') && (
              <div className="flex gap-3">
                <button onClick={() => approveReport(selected.id)} className="flex-1 py-2.5 rounded-xl text-white font-bold text-[13px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: '#22C55E' }}>
                  <CheckCircle2 size={15} /> Approve Report
                </button>
                <button onClick={() => setConfirmRevision(selected)} className="btn-destructive flex-1 py-2.5 flex items-center justify-center gap-2">
                  <RotateCcw size={15} /> Request Revision
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Upload modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Report" width={520}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Report Type</label>
            <select value={uploadType} onChange={e => setUploadType(e.target.value)} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
              {['Progress Report', 'Financial Report', 'Technical Report', 'Final Report'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Report Title</label>
            <input type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} placeholder="Enter report title..." className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Linked Project</label>
            <select value={uploadProject} onChange={e => setUploadProject(e.target.value)} className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
              <option>AW-2025-002 — Nanoparticle Drug Delivery</option>
              <option>AW-2025-001 — Predictive Diagnostics</option>
              <option>AW-2024-005 — Coastal Erosion Monitoring</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Upload File</label>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setSelectedFile(f); toast(`Selected: ${f.name}`, 'info'); } }} />
            <div
              className="flex flex-col items-center justify-center py-8 rounded-xl cursor-pointer border-2 border-dashed border-border bg-muted hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={28} className="text-primary mb-2.5" />
              {selectedFile ? (
                <>
                  <div className="font-bold text-[13px] text-foreground">{selectedFile.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB — click to change</div>
                </>
              ) : (
                <>
                  <div className="font-bold text-[13px] text-foreground">Click to upload or drag & drop</div>
                  <div className="text-[11px] text-muted-foreground mt-1">PDF, DOCX, XLSX · max 50MB</div>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Notes (optional)</label>
            <textarea rows={2} value={uploadNotes} onChange={e => setUploadNotes(e.target.value)} placeholder="Any additional notes for the reviewer..." className="w-full px-3 py-2 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowUpload(false); setSelectedFile(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button onClick={handleSubmitReport} disabled={uploading} className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
              {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : 'Submit Report'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Revision confirm dialog */}
      <ConfirmDialog
        open={!!confirmRevision}
        title="Request Revision"
        message={`This will mark "${confirmRevision?.title}" as needing revision. The researcher will be notified.`}
        confirmLabel="Request Revision"
        confirmColor="#EF4444"
        onConfirm={() => confirmRevision && requestRevision(confirmRevision.id)}
        onCancel={() => setConfirmRevision(null)}
      />
    </div>
  );
}
