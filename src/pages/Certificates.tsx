import React, { useEffect, useState } from 'react';
import { ExternalLink, Award, Calendar, CheckCircle } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { CertificateData, PublishedContent } from '../types';
import { SEOHead } from '../components/SEOHead';

export const Certificates: React.FC = () => {
  const [certs, setCerts] = useState<PublishedContent<CertificateData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<CertificateData>('certificate')
      .then(setCerts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <SEOHead
        title="Certifications & Accreditations — Rakshith YB"
        description="Formal engineering certifications and course completions of Rakshith YB, including Cisco CCNA."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Technical Credentials ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Certifications & Coursework
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          Accredited networking, cybersecurity, Python, and data science certifications from Cisco Networking Academy and Cisco certified training programs.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading certificates...
        </div>
      ) : certs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#D0D0D0] rounded-xl p-8 bg-[#FFFFFF]">
          <p className="text-sm text-[#4D4D4D] font-sans">No certificates published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="border border-[#D0D0D0] rounded-xl p-7 bg-[#FFFFFF] hover:border-[#0F0F0F] transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#DEDEDE] border border-[#BCBCBC] flex items-center justify-center text-[#171717] shrink-0">
                    <Award className="w-5 h-5 text-[#171717]" />
                  </div>
                  {cert.content_data.issueDate && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#717171]">
                      <Calendar className="w-3 h-3 text-[#717171]" />
                      <span>{cert.content_data.issueDate}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-lg font-serif font-bold text-[#171717]">
                    {cert.content_data.title}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#717171] font-mono">
                    Issuer: {cert.content_data.issuer}
                  </p>
                </div>

                {cert.content_data.credentialId && (
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-[#717171] block font-semibold mb-1">
                      Curriculum & Scope:
                    </span>
                    <p className="text-xs text-[#4D4D4D] leading-relaxed">
                      {cert.content_data.credentialId}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#D0D0D0] flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Coursework</span>
                </span>

                {cert.content_data.verificationUrl ? (
                  <a
                    href={cert.content_data.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-[#0F0F0F] hover:text-[#4D4D4D] transition-colors font-medium"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#717171]">
                    Cisco Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Certificates;
