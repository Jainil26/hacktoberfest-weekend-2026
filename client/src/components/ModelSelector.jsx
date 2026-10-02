import React from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';

export default function ModelSelector({ availableModels, selectedModel, onSelectModel, selectedModelError }) {
  const modelsList = availableModels && availableModels.length > 0
    ? availableModels
    : [
        { id: 'Qwen/Qwen2.5-72B-Instruct', displayName: 'Qwen2.5-72B-Instruct', providerCount: 1 },
        { id: 'meta-llama/Llama-3.3-70B-Instruct', displayName: 'Llama-3.3-70B-Instruct', providerCount: 1 },
        { id: 'deepseek-ai/DeepSeek-R1', displayName: 'DeepSeek-R1', providerCount: 1 }
      ];

  return (
    <div className="model-selector-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
        <Cpu size={16} color="var(--accent-primary)" />
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Hugging Face Router Model:</span>
      </div>

      <div style={{ flex: 1, maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <select
          className="model-select-dropdown"
          value={selectedModel}
          onChange={(e) => onSelectModel(e.target.value)}
          style={{
            background: 'var(--bg-input)',
            color: '#fff',
            border: selectedModelError ? '1px solid #f87171' : '1px solid var(--border-glow)',
            padding: '0.55rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {modelsList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} ({m.providerCount ? `${m.providerCount} live provider${m.providerCount > 1 ? 's' : ''}` : 'live'})
            </option>
          ))}
        </select>

        {selectedModelError && (
          <div style={{ fontSize: '0.78rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertTriangle size={13} />
            <span>{selectedModelError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
