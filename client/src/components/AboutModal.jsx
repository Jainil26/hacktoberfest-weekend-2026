import React from 'react';
import { X, Heart, ShieldCheck, Cpu, Code, BookOpen } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={22} color="#ec4899" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
              Build for a Friend Story
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem', color: '#d1d5db', lineHeight: 1.6 }}>
          <div style={{ background: 'var(--gradient-glow)', border: '1px solid var(--border-glow)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              🎯 Hacktoberfest 2026 Theme: "Build for a Friend"
            </h3>
            <p>
              <strong>StudyBuddy AI</strong> was crafted for a close university friend who frequently gets overwhelmed when reviewing massive 30-page lecture documents before final exams.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <BookOpen size={16} /> The Core Problem
            </h4>
            <p>
              Students waste hours re-reading long raw text instead of testing their active recall. StudyBuddy AI instantly condenses complex study material into a concise summary and 5 self-grading practice exam questions.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Cpu size={16} /> Open-Source & Open-Weight AI
            </h4>
            <p>
              This app leverages open-weight foundation models such as <strong>Qwen 2.5 72B</strong>, <strong>Llama 3.3 70B</strong>, and <strong>Mistral 7B</strong>.
            </p>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li><strong>Privacy & Data Control:</strong> Open-weight models can be hosted locally via Ollama or private servers without sending private student notes to closed proprietary APIs.</li>
              <li><strong>Transparency & Reproducibility:</strong> Model architecture and weights are publicly audited.</li>
              <li><strong>Cost Efficiency:</strong> Runs cost-effectively via free Hugging Face serverless tier or local GPU execution.</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Built with Node.js, Express, React & Hugging Face / Groq Open-Weight APIs.
            </span>
            <button className="btn-primary" onClick={onClose} style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
