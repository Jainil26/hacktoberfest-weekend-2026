import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

export default function FlashcardQuiz({ qaPairs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scores, setScores] = useState({});

  if (!qaPairs || qaPairs.length === 0) return null;

  const currentPair = qaPairs[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < qaPairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScore = (quality) => {
    const updated = { ...scores, [currentIndex]: quality };
    setScores(updated);

    // If completed all cards, trigger celebratory confetti
    if (Object.keys(updated).length === qaPairs.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    handleNext();
  };

  const completedCount = Object.keys(scores).length;
  const masterCount = Object.values(scores).filter((v) => v === 'got_it').length;

  return (
    <div className="flashcard-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '580px', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Card <span style={{ color: '#fff', fontWeight: 700 }}>{currentIndex + 1}</span> of {qaPairs.length}
        </div>

        {completedCount > 0 && (
          <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Award size={16} />
            <span>Mastered: {masterCount}/{qaPairs.length}</span>
          </div>
        )}
      </div>

      <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
        <div className="card-side-indicator">
          {isFlipped ? '✨ Answer & Key Concept' : '❓ Question (Click card to reveal answer)'}
        </div>

        <div className="flashcard-body">
          {isFlipped ? currentPair.answer : currentPair.question}
        </div>

        {isFlipped && currentPair.explanation && (
          <div className="answer-explanation" style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>Tip / Context:</strong> {currentPair.explanation}
          </div>
        )}

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <RotateCw size={12} />
          <span>Click anywhere on card to flip</span>
        </div>
      </div>

      <div className="flashcard-controls">
        <button
          className="btn-outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={18} />
          <span>Prev</span>
        </button>

        {isFlipped ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-outline"
              onClick={() => handleScore('need_review')}
              style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}
            >
              <AlertCircle size={16} />
              <span>Need Review</span>
            </button>
            <button
              className="btn-outline"
              onClick={() => handleScore('got_it')}
              style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}
            >
              <CheckCircle2 size={16} />
              <span>Got it!</span>
            </button>
          </div>
        ) : (
          <button className="btn-outline" onClick={() => setIsFlipped(true)}>
            <span>Reveal Answer</span>
          </button>
        )}

        <button
          className="btn-outline"
          onClick={handleNext}
          disabled={currentIndex === qaPairs.length - 1}
          style={{ opacity: currentIndex === qaPairs.length - 1 ? 0.4 : 1 }}
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
