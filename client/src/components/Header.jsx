import React from 'react';
import { Sparkles, Heart, HelpCircle, Cpu } from 'lucide-react';

export default function Header({ onOpenAbout, healthInfo }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <img src="/logo.jpg" alt="StudyBuddy AI" className="app-logo" onError={(e) => e.target.style.display = 'none'} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="brand-title">StudyBuddy AI</h1>
            <span className="badge-hacktoberfest">Hacktoberfest '26</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Exam Study Pack Generator • Built for a Friend
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.1)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <Cpu size={14} />
          <span>Open-Weight AI: {healthInfo?.defaultModel ? healthInfo.defaultModel.split('/').pop() : 'Qwen 2.5 / Llama 3.3'}</span>
        </div>

        <button className="btn-outline" onClick={onOpenAbout} title="Learn about the Hacktoberfest project">
          <Heart size={16} color="#ec4899" />
          <span>Built for a Friend</span>
        </button>
      </div>
    </header>
  );
}
