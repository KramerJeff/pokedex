# Pokédex Project - Development Reference

## Project Overview
A React-based Pokédex application displaying all 1000+ Pokemon with Gen III-IV retro sprites, featuring search functionality, type filtering, virtualized scrolling, and detailed stats view.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Data Fetching**: React Query (TanStack Query v5) with localStorage persistence
- **State Management**: Zustand
- **Routing**: React Router v7
- **Virtualization**: @tanstack/react-virtual
- **Styling**: Tailwind CSS 4
- **Data Source**: PokeAPI (https://pokeapi.co/api/v2/)

## Project Status

### ✅ Phase 1: Foundation (COMPLETE)
- [x] Project initialized with Vite + React + TypeScript
- [x] All dependencies installed (React Query, Zustand, React Router, React Virtual, Axios, Tailwind)
- [x] TypeScript interfaces for Pokemon API ([src/api/types.ts](src/api/types.ts))
- [x] API client with axios ([src/api/pokeapi.ts](src/api/pokeapi.ts))
- [x] API constants and cache config ([src/api/constants.ts](src/api/constants.ts))
- [x] React Query setup with localStorage persistence ([src/main.tsx](src/main.tsx))

### ✅ Phase 2: Core Data Layer (COMPLETE)
- [x] Create `usePokemonList()` hook in [src/hooks/usePokemonList.ts](src/hooks/usePokemonList.ts)
- [x] Create `usePokemonDetail(id)` hook in [src/hooks/usePokemonDetail.ts](src/hooks/usePokemonDetail.ts)
- [x] Create `useSprite(pokemon)` hook in [src/hooks/useSprite.ts](src/hooks/useSprite.ts)
- [x] Create `useSearch` hook in [src/hooks/useSearch.ts](src/hooks/useSearch.ts)
- [x] Create `useTypeFilter` hook in [src/hooks/useTypeFilter.ts](src/hooks/useTypeFilter.ts)
- [x] Implement sprite helper with fallback hierarchy in [src/utils/spriteHelpers.ts](src/utils/spriteHelpers.ts)
- [x] Implement Pokemon helper utilities in [src/utils/pokemonHelpers.ts](src/utils/pokemonHelpers.ts)
- [x] Setup Zustand store for search/filter state in [src/store/filterStore.ts](src/store/filterStore.ts)

### ✅ Phase 3: Basic UI (COMPLETE)
- [x] Create Layout and Header components in [src/components/layout/](src/components/layout/)
- [x] Build PokemonSprite component in [src/components/pokemon/PokemonSprite.tsx](src/components/pokemon/PokemonSprite.tsx)
- [x] Build PokemonCard component in [src/components/pokemon/PokemonCard.tsx](src/components/pokemon/PokemonCard.tsx)
- [x] Build PokemonGrid component in [src/components/pokemon/PokemonGrid.tsx](src/components/pokemon/PokemonGrid.tsx)
- [x] Create TypeBadge component in [src/components/common/TypeBadge.tsx](src/components/common/TypeBadge.tsx)
- [x] Create Loading and CardSkeleton components in [src/components/common/Loading.tsx](src/components/common/Loading.tsx)
- [x] Update [src/App.tsx](src/App.tsx) to use new components
- [x] Add pixelated sprite CSS to [src/index.css](src/index.css)
- [x] Test data flow with first 50 Pokemon - WORKING!

### 🔄 Phase 4: Search & Filter UI (NEXT - NOT STARTED)
- [ ] Implement SearchBar with debounced input in [src/components/filters/SearchBar.tsx](src/components/filters/)
- [ ] Build TypeFilter component in [src/components/filters/TypeFilter.tsx](src/components/filters/)
- [ ] Build FilterControls component in [src/components/filters/FilterControls.tsx](src/components/filters/)
- [ ] Integrate filters into App.tsx with filter store
- [ ] Test search and type filtering functionality
- [ ] Note: useSearch and useTypeFilter hooks already created in Phase 2

### 📋 Phase 5: Detail View (NOT STARTED)
- [ ] Setup React Router with `/pokemon/:id` route
- [ ] Build PokemonDetail modal in [src/components/pokemon/PokemonDetail.tsx](src/components/pokemon/)
- [ ] Display stats with progress bars
- [ ] Add Previous/Next navigation
- [ ] Implement keyboard shortcuts (arrow keys)

### 📋 Phase 6: Performance (NOT STARTED)
- [ ] Replace grid with virtualized version using @tanstack/react-virtual
- [ ] Implement progressive loading with Intersection Observer
- [ ] Add lazy loading for images with error handling
- [ ] Create loading skeletons in [src/components/common/Loading.tsx](src/components/common/)

### 📋 Phase 7: Polish (NOT STARTED)
- [ ] Style with Tailwind CSS (type colors, hover effects)
- [ ] Add error boundaries in [src/components/common/ErrorBoundary.tsx](src/components/common/)
- [ ] Improve accessibility (keyboard nav, ARIA labels)
- [ ] Responsive design for mobile

## Key Implementation Details

### Data Fetching Strategy
**Two-Phase Loading:**
1. **Phase 1**: Fetch lightweight Pokemon list (`/api/v2/pokemon?limit=10000`)
   - Returns only name and URL for all Pokemon (~40KB)
   - Cache with React Query for 24 hours
   - Parse IDs from URLs

2. **Phase 2**: Fetch individual Pokemon details on-demand
   - Load as cards enter viewport
   - Prefetch next 20 Pokemon in background
   - Cache individual Pokemon for 30 days

### Sprite Strategy
**Primary: FireRed/LeafGreen (Gen III)**
- Path: `sprites.versions['generation-iii']['firered-leafgreen'].front_default`
- Fallback hierarchy (defined in [src/api/constants.ts](src/api/constants.ts)):
  1. FireRed/LeafGreen
  2. Emerald
  3. Platinum
  4. HeartGold/SoulSilver
  5. Ruby/Sapphire
  6. Diamond/Pearl
  7. Official artwork
  8. Default sprite

### Caching Strategy
**Multi-Layer Caching:**
- **React Query (Memory)**: 1 hour stale time, 24 hour cache
- **LocalStorage (Persistent)**:
  - Pokemon list: 7 days
  - Individual Pokemon: 30 days
  - Configured in [src/main.tsx](src/main.tsx)
- **Browser Cache**: Automatic for sprite images

### Search & Filter Implementation
- **Search**: Client-side filtering with debounced input (300ms)
  - Search by name (partial match) or ID (exact match)
  - Case-insensitive
- **Type Filtering**: 18 Pokemon types as selectable badges
  - AND/OR filter mode toggle
  - OR mode: Pokemon has at least one selected type
  - AND mode: Pokemon has all selected types

### Performance Optimizations
- Virtual Scrolling: Render only ~50-100 visible cards
- Image Lazy Loading: `loading="lazy"` attribute
- Component Memoization: `React.memo` for PokemonCard
- Debounced Search: Prevent excessive re-filtering
- Code Splitting: Lazy load detail modal
- Progressive Loading: Load first 50, then fetch more on scroll

## Directory Structure
```
pokedex/
├── src/
│   ├── api/
│   │   ├── pokeapi.ts              ✅ API client & endpoints
│   │   ├── types.ts                ✅ TypeScript interfaces
│   │   └── constants.ts            ✅ API URLs, sprite paths, cache config
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          ✅ Pokédex header with branding
│   │   │   └── Layout.tsx          ✅ Main layout wrapper
│   │   ├── pokemon/
│   │   │   ├── PokemonCard.tsx     ✅ Pokemon card with sprite & types
│   │   │   ├── PokemonGrid.tsx     ✅ Responsive grid layout
│   │   │   ├── PokemonDetail.tsx   ⬜ Not created (Phase 5)
│   │   │   └── PokemonSprite.tsx   ✅ Sprite with loading/error states
│   │   ├── filters/
│   │   │   ├── SearchBar.tsx       ⬜ Not created (Phase 4)
│   │   │   ├── TypeFilter.tsx      ⬜ Not created (Phase 4)
│   │   │   └── FilterControls.tsx  ⬜ Not created (Phase 4)
│   │   └── common/
│   │       ├── Loading.tsx         ✅ Spinner & skeleton loaders
│   │       ├── ErrorBoundary.tsx   ⬜ Not created (Phase 7)
│   │       └── TypeBadge.tsx       ✅ Type badges with colors
│   ├── hooks/
│   │   ├── usePokemonList.ts       ✅ Fetch all Pokemon (lightweight)
│   │   ├── usePokemonDetail.ts     ✅ Fetch individual Pokemon
│   │   ├── useSearch.ts            ✅ Search by name/ID
│   │   ├── useTypeFilter.ts        ✅ Filter by types (AND/OR)
│   │   └── useSprite.ts            ✅ Get sprite with fallbacks
│   ├── store/
│   │   └── filterStore.ts          ✅ Zustand store for filters
│   ├── utils/
│   │   ├── pokemonHelpers.ts       ✅ Format helpers, type colors
│   │   ├── spriteHelpers.ts        ✅ Sprite URL with fallbacks
│   │   └── cache.ts                ⬜ Not needed (using React Query)
│   ├── App.tsx                     ✅ Main app with Pokemon grid
│   ├── index.css                   ✅ Tailwind + pixelated CSS
│   └── main.tsx                    ✅ React Query configured
```

## Reference: Detailed Implementation Plan

For the complete, detailed implementation plan including:
- Full API specifications
- Detailed component designs
- Step-by-step implementation guide
- Performance targets
- Future enhancements

**See**: `C:\Users\jeffk\.claude\plans\shimmering-twirling-naur.md`

## Quick Start Development

### Current Status
**Phases 1-3 Complete!** The Pokédex is functional and displays the first 50 Pokemon with Gen III sprites.

### What's Working:
- ✅ Pokemon data fetching with React Query caching
- ✅ Responsive grid layout (2-6 columns)
- ✅ Pokemon cards with sprites, names, IDs, and type badges
- ✅ Pixelated retro sprite rendering
- ✅ Loading states and error handling
- ✅ Lazy image loading

### Next Steps (Phase 4):
1. Build SearchBar component with debounced input
2. Build TypeFilter component with 18 type badges
3. Build FilterControls for AND/OR mode toggle
4. Integrate filter UI with existing filter store and hooks
5. Remove the 50 Pokemon limit once filtering works

### Running the Project
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Performance Targets
- Initial Load: < 2 seconds
- Time to Interactive: < 3 seconds
- Search/Filter Response: < 100ms
- Scroll Performance: 60fps
- Bundle Size: < 200KB gzipped

## Future Enhancements (Optional)
- Shiny sprite toggle
- Favorite Pokemon (localStorage)
- Sort options (ID, Name, Type)
- Generation filter
- Evolution chain display
- Move list and descriptions

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

Always use test-driven development when creating a new feature

Always create a new Git branch when working on a new feature and never work on the main branch
