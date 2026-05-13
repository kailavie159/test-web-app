import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Loader2, Send, X } from 'lucide-react';
import { supabase } from './supabaseClient';
import './styles.css';

function App() {
  const [choice, setChoice] = useState('');
  const [other, setOther] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => choice === 'yes' || choice === 'no', [choice]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      setStatus('error');
      setMessage('Choose Yes or No before submitting.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { error } = await supabase.from('survey_responses').insert({
      choice,
      other: other.trim() || null,
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('success');
    setMessage('Response saved.');
    setChoice('');
    setOther('');
  }

  return (
    <main className="page-shell">
      <section className="response-panel" aria-labelledby="page-title">
        <p className="eyebrow">Quick response</p>
        <h1 id="page-title">What is your answer?</h1>

        <form onSubmit={handleSubmit} className="response-form">
          <div className="choice-grid" role="group" aria-label="Choose an answer">
            <button
              className={`choice-button ${choice === 'yes' ? 'selected yes' : ''}`}
              type="button"
              onClick={() => setChoice('yes')}
              aria-pressed={choice === 'yes'}
            >
              <Check aria-hidden="true" />
              <span>Yes</span>
            </button>

            <button
              className={`choice-button ${choice === 'no' ? 'selected no' : ''}`}
              type="button"
              onClick={() => setChoice('no')}
              aria-pressed={choice === 'no'}
            >
              <X aria-hidden="true" />
              <span>No</span>
            </button>
          </div>

          <label className="field-label" htmlFor="other">
            Other
          </label>
          <textarea
            id="other"
            value={other}
            onChange={(event) => setOther(event.target.value)}
            placeholder="Add more details..."
            rows="5"
          />

          <button className="submit-button" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? <Loader2 className="spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
            <span>{status === 'loading' ? 'Saving' : 'Submit'}</span>
          </button>

          <p className={`status-message ${status}`} role="status" aria-live="polite">
            {message}
          </p>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
