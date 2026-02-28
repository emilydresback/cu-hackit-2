import { useState } from 'react';
import './App.css';

interface DojRelease {
  uuid: string;
  title: string;
  url: string;
  date?: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DojRelease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const params = new URLSearchParams({
        pagesize: '10',
        page: '0',
        sort: 'date',
        direction: 'DESC',
      });

      if (query.trim()) {
        // DOJ title filter
        params.append('parameters[title]', query.trim());
      }

      const res = await fetch(
        `https://www.justice.gov/api/v1/press_releases.json?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // DOJ format: { results: [...] }
      const items: DojRelease[] = (data.results || []).map((item: any) => ({
        uuid: item.uuid,
        title: item.title,
        url: item.url,
        date: item.date,
      }));

      setResults(items);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1.5rem' }}>
      <h1>GovDocs Explorer (DOJ)</h1>
      <p>
        Search public U.S. Department of Justice press releases by title to help
        people explore government documents.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="e.g. civil rights, fraud, antitrust..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '70%',
            marginRight: '0.5rem',
          }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      {loading && <p style={{ marginTop: '1rem' }}>Loading…</p>}
      {error && (
        <p style={{ marginTop: '1rem', color: 'red' }}>Error: {error}</p>
      )}

      <ul style={{ marginTop: '1.5rem', listStyle: 'none', padding: 0 }}>
        {results.map((item) => {
          let dateStr = '';
          if (item.date) {
            const n = Number(item.date);
            if (!Number.isNaN(n)) {
              // DOJ often returns unix timestamp (seconds)
              dateStr = new Date(n * 1000).toLocaleDateString();
            } else {
              dateStr = item.date;
            }
          }

          return (
            <li
              key={item.uuid}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem',
              }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 'bold', textDecoration: 'none' }}
              >
                {item.title}
              </a>
              {dateStr && (
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  Date: {dateStr}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!loading && !error && results.length === 0 && (
        <p style={{ marginTop: '1rem' }}>
          Try searching for something like <strong>"civil rights"</strong> or{' '}
          <strong>"health care fraud"</strong>.
        </p>
      )}
    </div>
  );
}

export default App;