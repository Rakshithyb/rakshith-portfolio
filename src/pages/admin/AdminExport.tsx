import React, { useState } from 'react';
import { Download, FileJson, Database, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { Button } from '../../components/Button';

export const AdminExport: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExportJSON = async () => {
    setDownloading(true);
    try {
      const exportData = await ContentStore.exportAllContent();
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rakshith-portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.message || 'Export failed');
    } finally {
      setDownloading(false);
    }
  };

  const restorationScript = `# Restore procedure:
1. Initialize target Supabase PostgreSQL instance with migrations from:
   /supabase/migrations/20261009000000_init_schema.sql
2. Import structured JSON content using ContentStore or the restore script.
3. Re-upload media assets from your local backup to the corresponding:
   - portfolio-public bucket
   - portfolio-private bucket
4. Verify Row Level Security policies via automated tests.`;

  const copyScript = () => {
    navigator.clipboard.writeText(restorationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-divider pb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
          Data Preservation
        </span>
        <h1 className="text-2xl font-serif font-bold text-ink">
          Backup, Export & Disaster Recovery
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Export complete database records, draft histories, settings, and media asset manifests in standard JSON.
        </p>
      </div>

      {/* Export Action Card */}
      <div className="border border-divider rounded-lg p-6 bg-white space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-serif font-bold text-ink flex items-center gap-2">
              <FileJson className="w-5 h-5 text-ink" />
              <span>Full Structured Content Export</span>
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed font-sans max-w-xl">
              Generates an authenticated JSON archive containing all records from <code>content_drafts</code>, <code>published_content</code>, <code>site_settings</code>, and the storage media manifest.
            </p>
          </div>

          <Button
            onClick={handleExportJSON}
            isLoading={downloading}
            className="font-mono text-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Archive</span>
          </Button>
        </div>

        <div className="p-3 rounded bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Important note regarding media files:</strong> The exported JSON contains metadata and storage paths for media assets (PDFs, project screenshots, resume), but does not contain the binary file bytes themselves. To maintain a full offline media backup, download files from the Supabase Storage buckets or your local archive folder.
          </div>
        </div>
      </div>

      {/* Disaster Recovery & Restoration Guide */}
      <div className="border border-divider rounded-lg p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-ink flex items-center gap-2">
            <Database className="w-5 h-5 text-ink" />
            <span>Disaster Recovery & Restoration Runbook</span>
          </h2>

          <button
            onClick={copyScript}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to clipboard!' : 'Copy runbook'}</span>
          </button>
        </div>

        <pre className="p-4 rounded bg-zinc-950 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
          <code>{restorationScript}</code>
        </pre>
      </div>
    </div>
  );
};
