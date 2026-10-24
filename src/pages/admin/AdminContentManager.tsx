import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Eye,
  ArrowUpRight,
  Globe,
  FileCheck,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { ContentType, ContentDraft, PublishedContent } from '../../types';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

interface AdminContentManagerProps {
  type: ContentType;
  title: string;
  description: string;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({
  type,
  title,
  description,
}) => {
  const [drafts, setDrafts] = useState<ContentDraft<any>[]>([]);
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<ContentDraft<any> | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [slug, setSlug] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [allDrafts, publishedList] = await Promise.all([
        ContentStore.getDrafts(type),
        ContentStore.getPublishedContent(type),
      ]);
      setDrafts(allDrafts);
      setPublishedSlugs(new Set(publishedList.map((p) => p.slug)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [type]);

  const handleOpenCreate = () => {
    setEditingDraft(null);
    setSlug('');
    setFormData(getInitialFormDataForType(type));
    setIsEditorOpen(true);
    setFeedback(null);
  };

  const handleOpenEdit = (draft: ContentDraft<any>) => {
    setEditingDraft(draft);
    setSlug(draft.slug);
    setFormData({ ...draft.draft_data });
    setIsEditorOpen(true);
    setFeedback(null);
  };

  const handleSaveDraft = async () => {
    if (!slug.trim()) {
      setFeedback({ message: 'Slug is required for url identification.', type: 'error' });
      return;
    }
    setIsSaving(true);
    try {
      await ContentStore.saveDraft({
        id: editingDraft?.id,
        content_type: type,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        draft_data: formData,
        version: editingDraft?.version || 1,
      });
      setFeedback({ message: 'Draft saved successfully (not published yet).', type: 'success' });
      await refreshData();
      setTimeout(() => setIsEditorOpen(false), 800);
    } catch (err: any) {
      setFeedback({ message: err?.message || 'Failed to save draft.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (draftId: string) => {
    try {
      await ContentStore.publishDraft(draftId);
      await refreshData();
      setFeedback({ message: 'Item published to public website!', type: 'success' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ message: err?.message || 'Publishing failed.', type: 'error' });
    }
  };

  const handleUnpublish = async (draftSlug: string) => {
    if (!window.confirm('Unpublish this item? It will be removed from public view but retained as a draft.')) {
      return;
    }
    try {
      await ContentStore.unpublishContent(type, draftSlug);
      await refreshData();
      setFeedback({ message: 'Item unpublished from public site.', type: 'success' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ message: err?.message || 'Unpublish failed.', type: 'error' });
    }
  };

  const handleDelete = async (id: string, itemSlug: string) => {
    if (!window.confirm(`Delete this draft? If published, it will also be unpublished.`)) {
      return;
    }
    try {
      await ContentStore.unpublishContent(type, itemSlug);
      await ContentStore.deleteDraft(id);
      await refreshData();
    } catch (err: any) {
      alert(err?.message || 'Delete error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            CMS Content Manager
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink">
            {title}
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            {description}
          </p>
        </div>

        <Button onClick={handleOpenCreate} size="sm" className="font-mono text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>New {title.replace(/s$/, '')}</span>
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-current opacity-70 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drafts List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-ink-faint">
          Loading {title}...
        </div>
      ) : drafts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-divider rounded-lg p-8 space-y-3">
          <p className="text-xs font-mono text-ink-muted">No drafts created for {title.toLowerCase()}.</p>
          <Button onClick={handleOpenCreate} size="sm" variant="outline">
            Create First Draft
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => {
            const isPublished = publishedSlugs.has(draft.slug);
            const itemName = getItemPrimaryLabel(type, draft.draft_data);

            return (
              <div
                key={draft.id}
                className="border border-divider rounded-lg p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-400 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm text-ink font-serif">
                      {itemName}
                    </span>
                    {isPublished ? (
                      <Badge variant="published">Published</Badge>
                    ) : (
                      <Badge variant="draft">Draft Only</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-ink-faint">
                    <span>Slug: <code className="text-zinc-800">{draft.slug}</code></span>
                    <span>•</span>
                    <span>v{draft.version}</span>
                    <span>•</span>
                    <span>Updated {new Date(draft.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(draft)}
                    title="Edit Draft Data"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>

                  {isPublished ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUnpublish(draft.slug)}
                      title="Remove from public site"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unpublish</span>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePublish(draft.id)}
                      title="Promote to public site"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish</span>
                    </Button>
                  )}

                  <button
                    onClick={() => handleDelete(draft.id, draft.slug)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors rounded"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-divider rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-divider flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">
                  {editingDraft ? `Edit ${title.replace(/s$/, '')}` : `New ${title.replace(/s$/, '')}`}
                </h3>
                <span className="text-[11px] font-mono text-ink-faint">
                  Saving updates content_drafts only. Explicit publish required to go live.
                </span>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-zinc-400 hover:text-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="space-y-1">
                <label className="block text-xs font-mono font-medium text-ink">
                  Unique Slug (URL identifier) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. distributed-task-queue"
                  className="w-full px-3 py-2 rounded border border-divider text-xs font-mono focus:border-ink outline-none"
                />
              </div>

              {renderFormFields(type, formData, setFormData)}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-divider bg-canvas-subtle flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveDraft}
                  isLoading={isSaving}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: initial form state generator based on type
function getInitialFormDataForType(type: ContentType): any {
  switch (type) {
    case 'project':
      return {
        title: '',
        tagline: '',
        description: '',
        category: 'Backend & Systems',
        tags: ['TypeScript', 'Node.js'],
        featured: false,
        githubUrl: 'https://github.com/Rakshithyb',
        liveDemoUrl: '',
        completionDate: '2026',
        caseStudyMarkdown: '### Project Overview\nDetailed description here.',
      };
    case 'skill':
      return {
        name: '',
        category: 'languages',
        context: '',
        highlighted: false,
      };
    case 'certificate':
      return {
        title: '',
        issuer: '',
        issueDate: '2025',
        credentialId: '',
        verificationUrl: '',
      };
    case 'experience':
      return {
        role: '',
        organization: '',
        location: 'Tiptur, Karnataka, India',
        startDate: '2025',
        endDate: '2025',
        isCurrent: false,
        description: '',
        responsibilities: ['Backend API development with Python & Flask'],
        technologies: ['Python', 'Flask', 'SQLite'],
      };
    case 'education':
      return {
        degree: 'B.E. in Computer Science and Engineering',
        institution: 'Kalpataru Institute of Technology | Tiptur',
        fieldOfStudy: 'Computer Science and Engineering',
        startDate: '2022',
        endDate: 'Current',
        gradeOrGpa: 'CGPA: 8.1 / 10',
        coursework: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Time & Space Complexity', 'Computer Networks (CCNA)'],
        details: '10th Standard: 75% | 12th Standard: 70%',
      };
    case 'achievement':
      return {
        title: '',
        eventOrOrganization: '',
        date: '2025',
        summary: '',
        proofUrl: '',
        badgeLabel: 'Finalist',
      };
    case 'blog_post':
      return {
        title: '',
        excerpt: '',
        contentMarkdown: '### Introduction\nStart writing your technical article here.',
        tags: ['Engineering', 'Architecture'],
        publishedDate: 'October 2026',
        readTimeMinutes: 5,
      };
    case 'resume':
      return {
        title: 'Rakshith YB — Resume',
        version: '2026.1',
        lastUpdated: 'October 2026',
        summary: '',
        downloadFilename: 'Rakshith_YB_Resume.pdf',
      };
    default:
      return {};
  }
}

function getItemPrimaryLabel(type: ContentType, data: any): string {
  if (!data) return 'Untitled';
  switch (type) {
    case 'project':
    case 'certificate':
    case 'achievement':
    case 'blog_post':
    case 'resume':
      return data.title || 'Untitled';
    case 'skill':
      return data.name || 'Unnamed Skill';
    case 'experience':
      return `${data.role || 'Role'} at ${data.organization || 'Organization'}`;
    case 'education':
      return `${data.degree || 'Degree'} — ${data.fieldOfStudy || 'Field'}`;
    default:
      return 'Untitled';
  }
}

function renderFormFields(type: ContentType, formData: any, setFormData: (data: any) => void) {
  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (type === 'project') {
    return (
      <div className="space-y-4 text-xs font-mono">
        <div>
          <label className="block mb-1 font-medium text-ink">Project Title *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Tagline</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => updateField('tagline', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Category</label>
          <input
            type="text"
            value={formData.category || ''}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="Backend & Systems, Web, Algorithms..."
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Tags (comma separated)</label>
          <input
            type="text"
            value={(formData.tags || []).join(', ')}
            onChange={(e) =>
              updateField(
                'tags',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              )
            }
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-ink">GitHub Repository URL</label>
            <input
              type="text"
              value={formData.githubUrl || ''}
              onChange={(e) => updateField('githubUrl', e.target.value)}
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-ink">Live Demo URL</label>
            <input
              type="text"
              value={formData.liveDemoUrl || ''}
              onChange={(e) => updateField('liveDemoUrl', e.target.value)}
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={Boolean(formData.featured)}
            onChange={(e) => updateField('featured', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="featured" className="text-ink font-medium">Highlight as Featured on Homepage</label>
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Brief Description</label>
          <textarea
            rows={2}
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Case Study (Markdown)</label>
          <textarea
            rows={6}
            value={formData.caseStudyMarkdown || ''}
            onChange={(e) => updateField('caseStudyMarkdown', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink font-mono text-xs"
          />
        </div>
      </div>
    );
  }

  if (type === 'skill') {
    return (
      <div className="space-y-4 text-xs font-mono">
        <div>
          <label className="block mb-1 font-medium text-ink">Skill Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Category</label>
          <select
            value={formData.category || 'languages'}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink bg-white"
          >
            <option value="languages">Languages</option>
            <option value="backend">Backend & Architecture</option>
            <option value="databases">Databases & Storage</option>
            <option value="frontend">Frontend & Web</option>
            <option value="tools">Developer Tools</option>
            <option value="other">CS Fundamentals & Other</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Context / Usage Notes</label>
          <input
            type="text"
            value={formData.context || ''}
            onChange={(e) => updateField('context', e.target.value)}
            placeholder="e.g. Core OOP, Concurrent collections, DSA"
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="highlighted"
            checked={Boolean(formData.highlighted)}
            onChange={(e) => updateField('highlighted', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="highlighted" className="text-ink font-medium">Highlight as Core Competency</label>
        </div>
      </div>
    );
  }

  if (type === 'certificate') {
    return (
      <div className="space-y-4 text-xs font-mono">
        <div>
          <label className="block mb-1 font-medium text-ink">Certificate Title *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Issuing Organization</label>
          <input
            type="text"
            value={formData.issuer || ''}
            onChange={(e) => updateField('issuer', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-ink">Issue Date</label>
            <input
              type="text"
              value={formData.issueDate || ''}
              onChange={(e) => updateField('issueDate', e.target.value)}
              placeholder="e.g. 2025"
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-ink">Credential ID</label>
            <input
              type="text"
              value={formData.credentialId || ''}
              onChange={(e) => updateField('credentialId', e.target.value)}
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Verification URL</label>
          <input
            type="text"
            value={formData.verificationUrl || ''}
            onChange={(e) => updateField('verificationUrl', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
      </div>
    );
  }

  if (type === 'blog_post') {
    return (
      <div className="space-y-4 text-xs font-mono">
        <div>
          <label className="block mb-1 font-medium text-ink">Article Title *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-medium text-ink">Publication Date</label>
            <input
              type="text"
              value={formData.publishedDate || ''}
              onChange={(e) => updateField('publishedDate', e.target.value)}
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-ink">Read Time (minutes)</label>
            <input
              type="number"
              value={formData.readTimeMinutes || 5}
              onChange={(e) => updateField('readTimeMinutes', Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Tags (comma separated)</label>
          <input
            type="text"
            value={(formData.tags || []).join(', ')}
            onChange={(e) =>
              updateField(
                'tags',
                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
              )
            }
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Short Excerpt</label>
          <textarea
            rows={2}
            value={formData.excerpt || ''}
            onChange={(e) => updateField('excerpt', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-ink">Markdown Body</label>
          <textarea
            rows={8}
            value={formData.contentMarkdown || ''}
            onChange={(e) => updateField('contentMarkdown', e.target.value)}
            className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink font-mono text-xs"
          />
        </div>
      </div>
    );
  }

  // Fallback for general types (experience, education, achievement, resume)
  return (
    <div className="space-y-4 text-xs font-mono">
      <div>
        <label className="block mb-1 font-medium text-ink">JSON Data Payload</label>
        <textarea
          rows={10}
          value={JSON.stringify(formData, null, 2)}
          onChange={(e) => {
            try {
              setFormData(JSON.parse(e.target.value));
            } catch {
              // ignore while typing invalid json
            }
          }}
          className="w-full px-3 py-2 rounded border border-divider outline-none focus:border-ink font-mono text-xs"
        />
      </div>
    </div>
  );
}
