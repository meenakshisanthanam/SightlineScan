import { useState } from 'react';
import { scanUrl } from './api';
import Report from './components/Report';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || status === 'loading') return;

    setStatus('loading');
    setError('');
    try {
      const result = await scanUrl(url);
      setReport(result);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  function handleRescan() {
    setReport(null);
    setStatus('idle');
    setError('');
    setUrl('');
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="kicker"></p>
        <h1 className="app__title">SightlineScan</h1>
        <p className="app__subtitle">
          SightlineScan can quickly find if your site is compliant with WCAG rules and suggest any necessary fixes!
        </p>
      </header>

      {status !== 'done' && (
        <form className="scan-form" onSubmit={handleSubmit}>
          <label htmlFor="url-input" className="kicker scan-form__label">
            Web address
          </label>
          <div className="scan-form__row">
            <input
              id="url-input"
              type="text"
              inputMode="url"
              placeholder="example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={status === 'loading'}
              autoFocus
            />
            <button className="button button--solid" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Scanning' : 'Scan'}
            </button>
          </div>
          {status === 'loading' && (
            <p className="scan-form__status" role="status">
              Loading the page and checking it against WCAG. Slower sites can take fifteen to
              twenty seconds.
            </p>
          )}
          {status === 'error' && (
            <p className="scan-form__status scan-form__status--error" role="alert">
              {error}
            </p>
          )}
        </form>
      )}

      {status === 'done' && report && <Report report={report} onRescan={handleRescan} />}

      <footer className="app__footer">
        <p>This tool was made by Meenakshi Santhanam.</p>
      </footer>
    </div>
  );
}
