import React, { useState } from 'react';
import { Sparkles, Layers, FileText, Download, Copy, Check, Eye, EyeOff, Cpu, Info } from 'lucide-react';
import FlashcardQuiz from './FlashcardQuiz.jsx';

export default function StudyPackView({ data }) {
  const [activeTab, setActiveTab] = useState('pack'); // 'pack' or 'cards'
  const [openAnswers, setOpenAnswers] = useState({});
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { summary, keyTakeaways, qaPairs, meta } = data;

  const toggleAnswer = (id) => {
    setOpenAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllAnswers = () => {
    const allOpen = Object.keys(openAnswers).length === qaPairs.length && Object.values(openAnswers).every(Boolean);
    if (allOpen) {
      setOpenAnswers({});
    } else {
      const newOpen = {};
      qaPairs.forEach(p => { newOpen[p.id] = true; });
      setOpenAnswers(newOpen);
    }
  };

  const exportAsMarkdown = () => {
    let md = `# StudyPack AI - Exam Prep Guide\n\n`;
    md += `**AI Model:** ${meta?.model || 'Open-Weight Model'} (${meta?.provider || 'Hugging Face'})\n\n`;
    md += `## 📝 Summary\n${summary}\n\n`;
    md += `## 🎯 Key Takeaways\n`;
    (keyTakeaways || []).forEach((t, i) => {
      md += `${i + 1}. ${t}\n`;
    });
    md += `\n## ❓ Practice Exam Questions & Answers\n\n`;
    (qaPairs || []).forEach((q, i) => {
      md += `### Q${i + 1}: ${q.question}\n`;
      md += `**Answer:** ${q.answer}\n`;
      if (q.explanation) md += `*Note:* ${q.explanation}\n`;
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyPack_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    let text = `STUDY PACK SUMMARY:\n${summary}\n\nKEY TAKEAWAYS:\n`;
    (keyTakeaways || []).forEach((t, i) => { text += `- ${t}\n`; });
    text += `\nPRACTICE QUESTIONS:\n`;
    (qaPairs || []).forEach((q, i) => {
      text += `\nQ${i + 1}: ${q.question}\nA: ${q.answer}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="results-header">
        <div>
          <h2 className="section-title">
            <Sparkles size={22} color="var(--accent-secondary)" />
            Generated Study Pack
          </h2>
          <div className="meta-info-tag">
            <Cpu size={14} color="var(--accent-emerald)" />
            <span>Model: <strong style={{ color: '#fff' }}>{meta?.model || 'Qwen 2.5 72B'}</strong> ({meta?.provider})</span>
          </div>
        </div>

        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'pack' ? 'active' : ''}`}
            onClick={() => setActiveTab('pack')}
          >
            <FileText size={16} />
            <span>Study Sheet</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            <Layers size={16} />
            <span>Flashcards ({qaPairs?.length || 5})</span>
          </button>
        </div>
      </div>

      {meta?.note && (
        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} color="var(--accent-primary)" />
          <span>{meta.note}</span>
        </div>
      )}

      {activeTab === 'cards' ? (
        <FlashcardQuiz qaPairs={qaPairs} />
      ) : (
        <div>
          {/* Summary Section */}
          <div className="summary-container">
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              SUMMARY OVERVIEW
            </h3>
            <p className="summary-text">{summary}</p>

            {keyTakeaways && keyTakeaways.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Key Concept Takeaways
                </h4>
                <div className="takeaways-list">
                  {keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="takeaway-item">
                      <strong style={{ color: 'var(--accent-secondary)' }}>• </strong>
                      {takeaway}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Practice Questions Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                5 Practice Exam Questions
              </h3>

              <button className="btn-outline" onClick={toggleAllAnswers} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                {Object.keys(openAnswers).length === qaPairs.length ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{Object.keys(openAnswers).length === qaPairs.length ? 'Hide All Answers' : 'Reveal All Answers'}</span>
              </button>
            </div>

            <div className="questions-list">
              {qaPairs.map((pair, index) => {
                const isOpen = Boolean(openAnswers[pair.id]);
                return (
                  <div key={pair.id || index} className="question-card">
                    <div className="question-header">
                      <span className="q-number">Q{index + 1}</span>
                      <div className="q-text">{pair.question}</div>
                    </div>

                    <button className="answer-toggle-btn" onClick={() => toggleAnswer(pair.id)}>
                      {isOpen ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span>{isOpen ? 'Hide Answer' : 'Show Answer & Explanation'}</span>
                    </button>

                    {isOpen && (
                      <div className="answer-box">
                        <div className="answer-box-title">ANSWER:</div>
                        <p style={{ fontSize: '0.98rem', lineHeight: '1.6' }}>{pair.answer}</p>
                        {pair.explanation && (
                          <div className="answer-explanation">
                            <strong>Explanation:</strong> {pair.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions / Export Bar */}
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <button className="btn-outline" onClick={exportAsMarkdown}>
                <Download size={16} />
                <span>Export Markdown</span>
              </button>

              <button className="btn-outline" onClick={copyToClipboard}>
                {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
