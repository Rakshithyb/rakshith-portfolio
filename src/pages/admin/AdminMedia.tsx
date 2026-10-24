import React, { useEffect, useState } from 'react';
import { Upload, Trash2, FileText, Image as ImageIcon, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { MediaAsset } from '../../types';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadVisibility, setUploadVisibility] = useState<'private' | 'public'>('public');

  const refreshMedia = async () => {
    setLoading(true);
    try {
      const assets = await ContentStore.getMediaAssets();
      setMediaList(assets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime types: only PDF and images allowed as per PRD
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Security policy violation: Only PDFs and standard image types (PNG, JPEG, WebP, SVG) are permitted.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    try {
      await ContentStore.saveMediaRecord({
        bucket: uploadVisibility === 'public' ? 'portfolio-public' : 'portfolio-private',
        storage_path: `uploads/${file.name}`,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        visibility: uploadVisibility,
      });
      await refreshMedia();
      alert(`Asset recorded in ${uploadVisibility === 'public' ? 'portfolio-public' : 'portfolio-private'} bucket.`);
    } catch (err: any) {
      alert(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? Please ensure it is not referenced in published content.`)) {
      return;
    }
    await ContentStore.deleteMediaAsset(id);
    await refreshMedia();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            Storage Engine
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink">
            Media & Asset Library
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Secure asset management supporting PDF documents and images with separate public and private buckets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-ink text-white text-xs font-mono cursor-pointer hover:bg-zinc-800 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Processing...' : 'Upload File'}</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Storage Architecture Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-divider rounded-lg p-4 bg-canvas-subtle space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>portfolio-private Bucket</span>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
            Holds draft assets and administrative documents. Anonymous requests receive HTTP 403 Forbidden.
          </p>
        </div>

        <div className="border border-divider rounded-lg p-4 bg-canvas-subtle space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>portfolio-public Bucket</span>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
            Holds promoted assets referenced by explicitly published content (e.g. public resume PDF, project screenshots).
          </p>
        </div>
      </div>

      {/* Asset List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-ink-faint">
          Loading assets...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider rounded-lg p-8">
          <p className="text-xs font-mono text-ink-muted">No media assets recorded.</p>
        </div>
      ) : (
        <div className="border border-divider rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-divider bg-canvas-subtle text-[11px] font-mono text-ink-faint uppercase tracking-wider">
                  <th className="p-3">File Name</th>
                  <th className="p-3">Bucket</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Visibility</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider font-mono">
                {mediaList.map((asset) => (
                  <tr key={asset.id} className="hover:bg-canvas-subtle transition-colors">
                    <td className="p-3 font-medium text-ink flex items-center gap-2">
                      {asset.mime_type.includes('pdf') ? (
                        <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                      <span className="truncate max-w-[200px]">{asset.file_name}</span>
                    </td>
                    <td className="p-3 text-ink-muted">{asset.bucket}</td>
                    <td className="p-3 text-ink-faint">{asset.mime_type}</td>
                    <td className="p-3 text-ink-faint">{(asset.size_bytes / 1024).toFixed(1)} KB</td>
                    <td className="p-3">
                      {asset.visibility === 'public' ? (
                        <Badge variant="published">Public</Badge>
                      ) : (
                        <Badge variant="draft">Private</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(asset.id, asset.file_name)}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                        title="Delete asset record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
