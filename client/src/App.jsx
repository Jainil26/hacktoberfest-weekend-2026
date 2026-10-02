import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header.jsx';
import NoteInput from './components/NoteInput.jsx';
import ModelSelector from './components/ModelSelector.jsx';
import StudyPackView from './components/StudyPackView.jsx';
import AboutModal from './components/AboutModal.jsx';
import { Sparkles, AlertCircle, Heart, Cpu, ExternalLink } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState('');
  const [selectedModel, setSelectedModel] = useState('Qwen/Qwen2.5-72B-Instruct');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [availableModels, setAvailableModels] = useState([]);
  const [modelError, setModelError] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studyPack, setStudyPack] = useState(null);
  
  const [healthInfo, setHealthInfo] = useState(null);
  const [sampleNotes, setSampleNotes] = useState([]);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    // Fetch live router models
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.models) && data.models.length > 0) {
          setAvailableModels(data.models);
          const hasQwen = data.models.some(m => m.id === 'Qwen/Qwen2.5-72B-Instruct');
          if (hasQwen) {
            setSelectedModel('Qwen/Qwen2.5-72B-Instruct');
          } else {
            setSelectedModel(data.models[0].id);
          }
        }
      })
      .catch(err => console.warn('Could not fetch router models:', err));

    // Fetch system health info
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthInfo(data);
      })
      .catch(err => console.warn('Could not connect to health API:', err));

    // Fetch sample presets
    fetch('/api/sample-notes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSampleNotes(data);
      })
      .catch(err => console.warn('Could not fetch sample notes:', err));
  }, []);

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    setModelError(null);
    setError(null);
  };

  const handleLoadSample = (sampleContent) => {
    setNotes(sampleContent);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError('Please paste study notes to generate a study pack.');
      return;
    }

    // Check if the selected model has a live provider
    if (availableModels.length > 0) {
      const targetObj = availableModels.find(m => m.id === selectedModel);
      if (!targetObj || !targetObj.hasLiveProvider) {
        const msg = `The selected model "${selectedModel}" currently has no available live providers on Hugging Face Router. Please select a different model from the list.`;
        setModelError(msg);
        setError(msg);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setStudyPack(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: notes,
          model: selectedModel,
          provider: selectedProvider
        })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to generate study pack.');
      }

      setStudyPack(resData.data);
      
      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.message || 'An error occurred while generating your Study Pack. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <Header onOpenAbout={() => setIsAboutOpen(true)} healthInfo={healthInfo} />

      {/* Friend Story Banner */}
      <div className="friend-banner">
        <div className="friend-banner-content">
          <div className="friend-banner-title">
            <Heart size={18} color="#ec4899" />
            <span>Built for a Friend • Hacktoberfest 2026 Challenge</span>
          </div>
          <p className="friend-banner-desc">
            Created for a friend who struggles with exam anxiety from long study notes. StudyBuddy AI transforms dense text into concise summaries and 5 practice questions instantly.
          </p>
        </div>

        <div className="open-weight-badge">
          <Cpu size={15} />
          <span>100% Open-Weight AI</span>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="glass-card">
        {/* Model Selector Bar */}
        <ModelSelector
          availableModels={availableModels}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          selectedModelError={modelError}
        />

        {/* Note Input */}
        <NoteInput
          notes={notes}
          setNotes={setNotes}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          sampleNotes={sampleNotes}
          onLoadSample={handleLoadSample}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <AlertCircle size={20} color="#f87171" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#fff', display: 'block', fontSize: '0.9rem' }}>Generation Error</strong>
            <span style={{ fontSize: '0.88rem' }}>{error}</span>
          </div>
        </div>
      )}

      {/* Results View */}
      <div ref={resultsRef}>
        {studyPack && <StudyPackView data={studyPack} />}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '2rem'
      }}>
        <p>StudyBuddy AI • Hacktoberfest 2026 "Build for a Friend" Challenge</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
          Powered by Open-Weight AI (Qwen 2.5 & Llama 3.3) via Hugging Face & Groq
        </p>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
