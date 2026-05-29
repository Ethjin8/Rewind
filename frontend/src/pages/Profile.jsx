import "./Profile.css";

import { useState } from 'react';

const STREAMING_SERVICES = [
  'Netflix',
  'Hulu',
  'Disney+',
  'Max',
  'Prime Video',
  'Apple TV+',
  'Peacock',
  'Paramount+',
];
import { getLoggedInUser } from '../lib/getLoggedInUser';

export default function Profile() {
  const [selectedServices, setSelectedServices] = useState([]);

  const username = {user?.username || 'Not logged in'}

  function toggleService(service) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <img
              className="profile-avatar"
              src="/blank-profile.png"
              alt={`${username} profile`}
            />
          </div>

          <p className="profile-kicker">ACCOUNT</p>
          <h1 className="profile-username">@{username}</h1>
          <p className="profile-subtitle">Your watch identity.</p>
        </div>

        <div className="profile-section">
          <div className="section-title-row">
            <h2 className="profile-section-title">STREAMING SERVICES</h2>
            <span className="service-count">
              {selectedServices.length} selected
            </span>
          </div>

          <p className="profile-section-copy">
            Pick the platforms you actually use.
          </p>

          <div className="service-grid">
            {STREAMING_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service);

              return (
                <button
                  key={service}
                  type="button"
                  className={`service-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleService(service)}
                >
                  <span className="service-label-top">
                    {isSelected ? 'WATCH ON' : 'ADD'}
                  </span>
                  <span className="service-label-name">{service}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="profile-btn profile-btn-primary">
            SAVE CHANGES
          </button>

          <button type="button" className="profile-btn profile-btn-secondary">
            SIGN OUT
          </button>
        </div>
      </section>
    </main>
  );
}