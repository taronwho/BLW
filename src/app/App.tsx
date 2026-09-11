import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { DisclaimerGate } from './DisclaimerGate';
import { HomeScreen } from './HomeScreen';
import { HouseholdScreen } from './HouseholdScreen';
import { JoinHousehold } from './JoinHousehold';
import { UpdatePrompt } from './UpdatePrompt';

/**
 * HashRouter, protože GitHub Pages neumí SPA fallback na podadresářích
 * (CLAUDE.md, technický stack).
 */
export function App(): ReactNode {
  return (
    <HashRouter>
      <DisclaimerGate>
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col gap-6 px-4 py-6">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/domacnost" element={<HouseholdScreen />} />
            <Route path="/domacnost/pripojit/:kod" element={<JoinHousehold />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <UpdatePrompt />
      </DisclaimerGate>
    </HashRouter>
  );
}
