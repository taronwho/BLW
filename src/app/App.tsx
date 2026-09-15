import { HashRouter, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { AppShell } from './components/AppShell';
import { DisclaimerGate } from './DisclaimerGate';
import { JoinHousehold } from './JoinHousehold';
import { ScrollToTop } from './components/ScrollToTop';
import { UpdatePrompt } from './UpdatePrompt';
import { HomeScreen } from './screens/HomeScreen';

/**
 * HashRouter, protože GitHub Pages neumí SPA fallback na podadresářích
 * (CLAUDE.md, technický stack). Obrazovky podle docs/SPEC.md kapitola 4.
 *
 * Obrazovky se stahují až při prvním otevření. Dřív se stahovalo všechno
 * naráz — 300 receptů i s postupy, celý katalog surovin a knihovna pro
 * sdílení — a rodič na to čekal, i když si šel jen přečíst, jak se krájí
 * hruška. Úvodní obrazovka zůstává v prvním balíku, protože ta se ukáže
 * vždycky a čekat na ni by nedávalo smysl.
 */
const IngredientsScreen = lazy(() =>
  import('./screens/IngredientsScreen').then((m) => ({ default: m.IngredientsScreen })),
);
const IngredientDetailScreen = lazy(() =>
  import('./screens/IngredientDetailScreen').then((m) => ({ default: m.IngredientDetailScreen })),
);
const RecipesScreen = lazy(() =>
  import('./screens/RecipesScreen').then((m) => ({ default: m.RecipesScreen })),
);
const RecipeDetailScreen = lazy(() =>
  import('./screens/RecipeDetailScreen').then((m) => ({ default: m.RecipeDetailScreen })),
);
const GuidesScreen = lazy(() =>
  import('./screens/GuidesScreen').then((m) => ({ default: m.GuidesScreen })),
);
const GuideDetailScreen = lazy(() =>
  import('./screens/GuideDetailScreen').then((m) => ({ default: m.GuideDetailScreen })),
);
const DiaryScreen = lazy(() =>
  import('./screens/DiaryScreen').then((m) => ({ default: m.DiaryScreen })),
);
const HouseholdScreen = lazy(() =>
  import('./screens/HouseholdScreen').then((m) => ({ default: m.HouseholdScreen })),
);
const ListsScreen = lazy(() =>
  import('./screens/ListsScreen').then((m) => ({ default: m.ListsScreen })),
);
const ListDetailScreen = lazy(() =>
  import('./screens/ListDetailScreen').then((m) => ({ default: m.ListDetailScreen })),
);
const PlanScreen = lazy(() =>
  import('./screens/PlanScreen').then((m) => ({ default: m.PlanScreen })),
);
/* Přehled o používání. Otevře se jen na adrese s tajným klíčem, jinak se
   tváří jako neexistující stránka. Podrobnosti v src/admin/tajnyOdkaz.ts. */
const AdminScreen = lazy(() =>
  import('./screens/AdminScreen').then((m) => ({ default: m.AdminScreen })),
);
const NotFoundScreen = lazy(() =>
  import('./screens/NotFoundScreen').then((m) => ({ default: m.NotFoundScreen })),
);

/**
 * Co je vidět, než se obrazovka stáhne.
 *
 * Text, ne točící se kolečko: na rychlé síti problikne a nikoho nezaujme,
 * na pomalé aspoň řekne, že se něco děje. `role="status"` to oznámí i
 * odečítači obrazovky.
 */
function Nacita(): ReactNode {
  return (
    <p role="status" className="px-2 py-8 text-sm text-muted" data-testid="nacita-obrazovku">
      Načítám…
    </p>
  );
}

export function App(): ReactNode {
  return (
    <HashRouter>
      <ScrollToTop />
      <DisclaimerGate>
        <AppShell>
          <Suspense fallback={<Nacita />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/suroviny" element={<IngredientsScreen />} />
              <Route path="/suroviny/:id" element={<IngredientDetailScreen />} />
              <Route path="/recepty" element={<RecipesScreen />} />
              <Route path="/recepty/:id" element={<RecipeDetailScreen />} />
              <Route path="/rady" element={<GuidesScreen />} />
              <Route path="/rady/:id" element={<GuideDetailScreen />} />
              <Route path="/seznamy" element={<ListsScreen />} />
              <Route path="/seznamy/:id" element={<ListDetailScreen />} />
              <Route path="/plan" element={<PlanScreen />} />
              <Route path="/x/:klic" element={<AdminScreen />} />
              <Route path="/denik" element={<DiaryScreen />} />
              <Route path="/domacnost" element={<HouseholdScreen />} />
              <Route path="/domacnost/pripojit/:kod" element={<JoinHousehold />} />
              {/* Ne tiché přesměrování na úvod — stará záložka si zaslouží
                  vysvětlení, ne zdánlivě rozbitou aplikaci. */}
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </Suspense>
        </AppShell>
        <UpdatePrompt />
      </DisclaimerGate>
    </HashRouter>
  );
}
