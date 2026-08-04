import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoShell } from './DemoShell.js';
// `styles.css` first: `MapBoard` draws against its `.board` / `.sector` /
// `.region-label` rules and would render unstyled without it. `shell.css` loads
// second so the chrome's overrides win where the two meet.
import './styles.css';
import './shell.css';

const host = document.getElementById('root');
if (!host) throw new Error('Missing #root mount point.');

createRoot(host).render(
  <StrictMode>
    <DemoShell />
  </StrictMode>,
);
