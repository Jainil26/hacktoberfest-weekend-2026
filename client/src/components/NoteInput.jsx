import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Trash2, FileText, Loader2 } from 'lucide-react';

const LOADING_MESSAGES = [
  "Reading study notes...",
  "Distilling key principles with Open-Weight AI...",
  "Drafting concise summary takeaways...",
  "Generating 5 practice exam questions & answers...",
  "Finalizing your personalized Study Pack..."
];

export default function NoteInput({ notes, setNotes, onGenerate, isLoading, sampleNotes, onLoadSample }) {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const charCount = notes.length;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 className="section-title">
          <BookOpen size={20} color="var(--accent-primary)" />
          Paste Your Study Notes
        </h2>

        {notes.length > 0 && !isLoading && (
          <button 
            className="btn-outline" 
            onClick={() => setNotes('')}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
          >
            <Trash2 size={13} />
            <span>Clear Text</span>
          </button>
        )}
      </div>

      <div className="textarea-container">
        <textarea
          className="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste lecture notes, textbook chapters, or exam study guides here... (e.g. Photosynthesis converts sunlight into glucose in chloroplasts...)"
          disabled={isLoading}
        />

        <div className="textarea-footer">
          <div className="preset-buttons">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginRight: '0.2rem' }}>
              <FileText size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Sample Presets:
            </span>
            {sampleNotes.map((sample) => (
              <button
                key={sample.id}
                type="button"
                className="btn-preset"
                onClick={() => onLoadSample(sample.content)}
                disabled={isLoading}
              >
                {sample.title.split(':')[0]}
              </button>
            ))}
          </div>

          <div>
            <span>{wordCount} words</span> • <span>{charCount} chars</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onGenerate}
          disabled={isLoading || !notes.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" size={20} />
              <span>{LOADING_MESSAGES[loadingStep]}</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Study Pack</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
