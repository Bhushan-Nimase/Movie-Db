import { useState } from 'react';
import { Tv, ExternalLink, Globe } from 'lucide-react';

const COUNTRIES = [
  { code: 'IN', name: 'India (IN)' },
  { code: 'US', name: 'United States (US)' },
  { code: 'GB', name: 'United Kingdom (GB)' },
  { code: 'CA', name: 'Canada (CA)' },
  { code: 'AU', name: 'Australia (AU)' },
  { code: 'DE', name: 'Germany (DE)' },
  { code: 'FR', name: 'France (FR)' },
];

export default function WatchProviders({ providersData }) {
  const [region, setRegion] = useState('IN');

  if (!providersData || Object.keys(providersData).length === 0) {
    return (
      <div style={{
        padding: '1.2rem 1.4rem',
        background: 'var(--paper2)',
        border: '1px solid var(--rule)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        color: 'var(--ink-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', marginBottom: 4, fontWeight: 600 }}>
          <Tv size={16} color="var(--accent)" /> Where to Watch
        </div>
        No streaming options reported for this title yet. Check local theater schedules or digital storefronts.
      </div>
    );
  }

  const regionInfo = providersData[region] || providersData['US'] || providersData['IN'] || Object.values(providersData)[0];
  const activeRegionCode = regionInfo ? (providersData[region] ? region : Object.keys(providersData)[0]) : region;

  const flatrate = regionInfo?.flatrate || [];
  const rent = regionInfo?.rent || [];
  const buy = regionInfo?.buy || [];
  const link = regionInfo?.link;

  return (
    <div style={{
      background: 'var(--paper-raised)',
      border: '1px solid var(--rule-strong)',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {/* Title & Region selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--rule)',
        marginBottom: '1.2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tv size={18} color="var(--accent)" />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)' }}>
            Where to Watch
          </h2>
        </div>

        {/* Region selector dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={13} color="var(--ink-faint)" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              padding: '5px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--ink)',
              cursor: 'pointer',
              outline: 'none',
              borderRadius: 4,
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content groups */}
      {!flatrate.length && !rent.length && !buy.length ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
          No active streaming, rent, or buy availability listed for this region ({activeRegionCode}). Try switching region above.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Streaming / Flatrate */}
          {flatrate.length > 0 && (
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                fontWeight: 600,
                marginBottom: 8,
              }}>
                Stream Included
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {flatrate.map((provider) => (
                  <div
                    key={provider.provider_id}
                    title={provider.provider_name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--paper2)',
                      padding: '5px 12px 5px 8px',
                      border: '1px solid var(--rule-strong)',
                      borderRadius: 4,
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                      alt={provider.provider_name}
                      style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
                    />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)' }}>
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rent */}
          {rent.length > 0 && (
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                fontWeight: 600,
                marginBottom: 8,
              }}>
                Rent HD / 4K
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {rent.map((provider) => (
                  <div
                    key={provider.provider_id}
                    title={provider.provider_name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--paper)',
                      padding: '4px 10px 4px 6px',
                      border: '1px solid var(--rule)',
                      borderRadius: 4,
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                      alt={provider.provider_name}
                      style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover' }}
                    />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink)' }}>
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buy */}
          {buy.length > 0 && (
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                fontWeight: 600,
                marginBottom: 8,
              }}>
                Buy Digital
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {buy.map((provider) => (
                  <div
                    key={provider.provider_id}
                    title={provider.provider_name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--paper)',
                      padding: '4px 10px 4px 6px',
                      border: '1px solid var(--rule)',
                      borderRadius: 4,
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                      alt={provider.provider_name}
                      style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover' }}
                    />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--ink)' }}>
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attribution & direct link */}
      <div style={{
        marginTop: '1.2rem',
        paddingTop: '0.8rem',
        borderTop: '1px dashed var(--rule)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)' }}>
          Provider data powered by JustWatch via TMDB
        </span>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Check JustWatch <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
