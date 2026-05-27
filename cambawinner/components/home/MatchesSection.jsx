'use client';
import { useState } from 'react';
import MatchCard from '@/components/odds/MatchCard';
import { Theme } from '@/lib/theme';

const SPORT_TABS = [
  { id: 'todos',   label: 'Todos' },
  { id: 'futbol',  label: 'Fútbol' },
  { id: 'basquet', label: 'Básquet' },
  { id: 'tenis',   label: 'Tenis' },
];

function SportTab({ id, label, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '6px 16px',
        borderRadius: '20px',
        border: `1.5px solid ${isActive ? Theme.Colors.Green : 'rgba(184,212,244,0.25)'}`,
        background: isActive ? Theme.Colors.Green : 'transparent',
        color: isActive ? Theme.Colors.TextInverse : Theme.Colors.TextAccent,
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function MatchesSection({ matches }) {
  const [activeTab, setActiveTab] = useState('todos');

  const filtered = (activeTab === 'todos' || activeTab === 'futbol') ? matches : [];

  return (
    <section>
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: Theme.Spacing.SM,
          overflowX: 'auto',
          paddingBottom: Theme.Spacing.SM,
          marginBottom: Theme.Spacing.LG,
          scrollbarWidth: 'none',
        }}
      >
        {SPORT_TABS.map(tab => (
          <SportTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: Theme.Colors.TextMuted, textAlign: 'center', padding: `${Theme.Spacing.XXL} 0` }}>
          Sin partidos disponibles para este deporte.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(match => (
            <MatchCard key={match.id} {...match} />
          ))}
        </div>
      )}
    </section>
  );
}
