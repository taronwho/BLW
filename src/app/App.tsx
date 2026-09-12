import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppShell } from './components/AppShell';
import { DisclaimerGate } from './DisclaimerGate';
import { JoinHousehold } from './JoinHousehold';
import { UpdatePrompt } from './UpdatePrompt';
import { DiaryScreen } from './screens/DiaryScreen';
import { HouseholdScreen } from './screens/HouseholdScreen';
import { IngredientDetailScreen } from './screens/IngredientDetailScreen';
import { IngredientsScreen } from './screens/IngredientsScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { RecipesScreen } from './screens/RecipesScreen';

/**
 * HashRouter, protože GitHub Pages neumí SPA fallback na podadresářích
 * (CLAUDE.md, technický stack). Obrazovky podle docs/SPEC.md kapitola 4.
 */
export function App(): ReactNode {
  return (
    <HashRouter>
      <DisclaimerGate>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/suroviny" replace />} />
            <Route path="/suroviny" element={<IngredientsScreen />} />
            <Route path="/suroviny/:id" element={<IngredientDetailScreen />} />
            <Route path="/recepty" element={<RecipesScreen />} />
            <Route path="/recepty/:id" element={<RecipeDetailScreen />} />
            <Route path="/denik" element={<DiaryScreen />} />
            <Route path="/domacnost" element={<HouseholdScreen />} />
            <Route path="/domacnost/pripojit/:kod" element={<JoinHousehold />} />
            <Route path="*" element={<Navigate to="/suroviny" replace />} />
          </Routes>
        </AppShell>
        <UpdatePrompt />
      </DisclaimerGate>
    </HashRouter>
  );
}
