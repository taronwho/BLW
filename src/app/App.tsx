import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { DisclaimerGate } from './DisclaimerGate';
import { HomeScreen } from './HomeScreen';

/**
 * HashRouter, protože GitHub Pages neumí SPA fallback na podadresářích
 * (CLAUDE.md, technický stack).
 */
export function App(): ReactNode {
  return (
    <HashRouter>
      <DisclaimerGate>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DisclaimerGate>
    </HashRouter>
  );
}
