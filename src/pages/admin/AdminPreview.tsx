import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft, CheckCircle, AlertCircle, Globe, Shield, RefreshCw } from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { ContentDraft, ContentType } from '../../types';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AdminPreview: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ContentType>('project');
  const [drafts, setDrafts] = useState<ContentDraft<any>[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadDrafts = async (type: ContentType) => {
    setLoading(true);
    try {
      const data = await ContentStore.getDrafts(type);
      setDrafts(data);
      if (data.length > 0) {
        setSelectedDraftId(data[0].id);
      } else {
        setSelectedDraftId('');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts(selectedType);
  }, [selectedType]);

  const activeDraft = drafts.find((d) => d.id === selectedDraftId);

  const handlePublishCurrent = async () => {
    if (!activeDraft) return;
    setPublishing(true);
    try {
      await ContentStore.publishDraft(activeDraft.id);
      setMessage(`Draft "${activeDraft.slug}" successfully published to live website!`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err?.message || 'Publishing error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Navigation Banner */}
      <div className="bg-zinc-950 text-white rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-amber-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs font-mono uppercase tracking-wider text-amber-400">
                Private Admin Preview Mode
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
                Hidden from public visitors
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              Renders draft records in full fidelity before they are promoted to live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeDraft && (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublishCurrent}
              isLoading={publishing}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 font-mono text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publish This Draft Now</span>
            </Button>
          )}

          <Link to="/admin">
            <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800 font-mono text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CMS</span>
            </Button>
          </Link>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-3 border-b border-divider pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ink-muted">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ContentType)}
            className="px-2.5 py-1 rounded border border-divider text-xs font-mono bg-white outline-none"
          >
            <option value="project">Projects</option>
            <option value="skill">Skills</option>
            <option value="certificate">Certificates</option>
            <option value="experience">Experience</option>
            <option value="education">Education</option>
            <option value="achievement">Achievements</option>
            <option value="blog_post">Blog Posts</option>
            <option value="resume">Resume</option>
          </select>
        </div>

        {drafts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-muted">Draft Item:</span>
            <select
              value={selectedDraftId}
              onChange={(e) => setSelectedDraftId(e.target.value)}
              className="px-2.5 py-1 rounded border border-divider text-xs font-mono bg-white outline-none max-w-xs"
            >
              {drafts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.slug} (v{d.version})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Preview Canvas */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-ink-faint">
          Loading draft preview...
        </div>
      ) : !activeDraft ? (
        <div className="py-16 text-center border border-dashed border-divider rounded-lg p-8 space-y-2">
          <p className="text-xs font-mono text-ink-muted">No drafts available for this section.</p>
        </div>
      ) : (
        <div className="border border-divider rounded-lg p-6 sm:p-10 bg-white space-y-6">
          <div className="flex items-center justify-between border-b border-divider pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-ink-faint uppercase tracking-wider">
                Draft Preview ({activeDraft.content_type})
              </span>
              <h2 className="text-xl font-serif font-bold text-ink">
                {activeDraft.draft_data?.title || activeDraft.draft_data?.name || activeDraft.slug}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="draft">Draft v{activeDraft.version}</Badge>
            </div>
          </div>

          {/* Render Raw Draft Data Preview */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
              Draft Properties & Content State
            </div>
            <pre className="p-4 rounded bg-canvas-subtle border border-divider text-xs font-mono text-ink overflow-x-auto leading-relaxed">
              <code>{JSON.stringify(activeDraft.draft_data, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
