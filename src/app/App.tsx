import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { DisclaimerGate } from './DisclaimerGate';
import { DiaryScreen } from './DiaryScreen';
import { HouseholdScreen } from './HouseholdScreen';
import { IngredientDetail } from './IngredientDetail';
import { IngredientsScreen } from './IngredientsScreen';
import { JoinHousehold } from './JoinHousehold';
import { RecipeDetail } from './RecipeDetail';
import { RecipesScreen } from './RecipesScreen';
import { UpdatePrompt } from './UpdatePrompt';
import { BottomNav } from './components/BottomNav';

/**
 * HashRouter, protože GitHub Pages neumí SPA fallback na podadresářích
 * (CLAUDE.md, technický stack).
 */
export function App(): ReactNode {
  return (
    <HashRouter>
      <DisclaimerGate>
        {/* pb-24: obsah nesmí zmizet pod spodní lištou */}
        <main className="mx-auto flex min-h-full w-full max-w-md flex-col gap-6 px-4 pb-24 pt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/suroviny" replace />} />
            <Route path="/suroviny" element={<IngredientsScreen />} />
            <Route path="/suroviny/:id" element={<IngredientDetail />} />
            <Route path="/recepty" element={<RecipesScreen />} />
            <Route path="/recepty/:id" element={<RecipeDetail />} />
            <Route path="/denik" element={<DiaryScreen />} />
            <Route path="/domacnost" element={<HouseholdScreen />} />
            <Route path="/domacnost/pripojit/:kod" element={<JoinHousehold />} />
            <Route path="*" element={<Navigate to="/suroviny" replace />} />
          </Routes>
        </main>
        <BottomNav />
        <UpdatePrompt />
      </DisclaimerGate>
    </HashRouter>
  );
}
