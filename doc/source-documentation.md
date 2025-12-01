# SEPE Source Code Documentation

## Source Tree

```text
src/
├── App.jsx                  // Main React app entry point
├── assets/                  // Static assets (images, icons)
│   ├── images/
│   │   └── logo/
│   │       └── fpt-logo.webp // FPT University logo
│   └── react.svg            // React logo
├── components/              // Reusable UI components
│   ├── layouts/             // Layouts for different user roles
│   │   ├── AdminLayout.jsx      // Main admin layout. Provides a fixed sidebar with navigation (Dashboard, Hackathons, Phases, Prizes, Challenges, Seasons, Users, Teams, Files, Settings), admin logo, user avatar, and logout dropdown. The header displays user info and logout. The center area renders the current admin page via <Outlet />. Uses Ant Design for UI, React Router for navigation, and custom hooks for user data and logout.
│   │   ├── AntdProvider.jsx     // Provides Ant Design theme context for the app. Wraps children with ConfigProvider and sets the primary color to green (#01bd30) for consistent UI theming.
│   │   ├── Footer.jsx           // Application footer. Displays FPT logo, SEAL Hackathon branding, platform/resource/company links, copyright, and social icons (Twitter, GitHub, LinkedIn). Responsive grid layout, styled with Tailwind CSS.
│   │   ├── JudgeLayout.jsx      // Main judge layout. Sidebar with single menu item (Team Scores), judge avatar, and info. Header displays judge name and logout. Center area renders judge pages via <Outlet />. Uses Ant Design, React Router, and custom hooks for user data and logout.
│   │   ├── LandingLayout.jsx    // Minimal layout for the landing page. Renders children in a full-height main area. Navbar and Footer are optional and can be toggled via comments.
│   │   ├── PartnerLayout.jsx    // Main partner layout. Sidebar with 3 menu items (Hackathons, Challenges, Team Scores), partner avatar, and info. Header displays partner name and logout. Center area renders partner pages via <Outlet />. Uses Ant Design, React Router, and custom hooks for user data and logout.
│   │   └── UserDropdown.jsx     // User account dropdown menu. Shows login/register if not authenticated, or account management/logout if logged in. Handles logout logic and links to user info page. Uses Lucide icons, React Router, and custom hooks for user data and logout.
│   ├── login/
│   │   └── index.jsx            // Login form component. Integrates Google OAuth for authentication, handles login success/error, sets access/refresh tokens in cookies, decodes JWT for user role, and redirects based on role. Uses React Query, js-cookie, jwt-decode, and custom notification utility.
│   ├── NotificationBell.jsx     // Notification bell icon component. Displays notification count, toggles a dropdown with a list of notifications, highlights unread items, and provides a link to view all notifications. Uses local state and styled with Tailwind CSS.
│   ├── ui/                      // UI form and input components
│   │   ├── CreateEditForm.jsx   // Dynamic form for creating or editing entities. Supports input, textarea, dropdown, datetime, and column layouts. Handles validation, initial values, and submission. Uses Ant Design components, dayjs for date logic, and Tailwind CSS for styling.
│   │   ├── DatePicker.jsx       // Date picker input
│   │   ├── EntityDetail.jsx     // Entity detail view: Renders a full-detail view for an entity using a model-driven fields definition. Supports many field types (input, textarea, dropdown, datetime, column, tag, file, status, boolean, array, object, url, custom, id). Responsibilities include: formatting dates with dayjs (with per-field format overrides), extracting filenames and rendering download/view links for files, rendering tags/status/badges, handling nested arrays/objects and column layouts, and delegating custom value rendering/transform via `valueRenders` and `valueTransforms` props. Accepts props: `entityName`, `model`, `data`, `onBack`, `onEdit`, `showEdit`, `headerExtra`, `dateFormatMap`, `valueTransforms`, `valueRenders`. Uses Ant Design (Card, List, Tag, Badge, Button) and icons; intended for admin/member detail pages where read-only presentation with optional edit/download actions is needed.
│   │   ├── EntityTable.jsx      // Table for entities. Model-driven table builder using Ant Design Table. Accepts a `model` with `columns`, `actions`, `rowKey`, and `createButton`. Supports column types like text, tag, datetime, status, badge and allows custom render, transform, and status maps. Renders action buttons (view/edit/delete/extra) with tooltips and handlers; formats dates via dayjs and provides customizable empty/loading states. Intended for listing entities and performing row-level actions in admin and partner pages.
│   │   ├── Form.jsx             // Generic Form wrapper component. Wraps Ant Design Form with project-specific classNames and exposes Form.Item, Form.List, ErrorList, and useForm. Used across forms to maintain consistent styling.
│   │   ├── index.jsx            // UI entry point: re-exports UI components (Input, Select, DatePicker, InputNumber, Form) for consistent imports across the app.
│   │   ├── Input.jsx            // Text input: wrapper around Ant Design Input with consistent project styling. Exposes TextArea, Password, and Search variants.
│   │   ├── InputNumber.jsx      // Number input: wrapper around Ant Design InputNumber with project styling.
│   │   └── Select.jsx           // Select dropdown: wrapper around Ant Design Select with custom dropdown styling and helper CSS injected on mount.
│   └── UserMenu.jsx             // User menu component
├── configs/                  // Configuration files
│   ├── axiosClient.js        // Axios HTTP client config. Creates an axios instance with baseURL from Vite env (VITE_BASE_URL). Attaches access token from cookies to Authorization header for requests. Response interceptor handles 401 responses: attempts refresh via `callRefreshToken`, updates cookies and retries the original request if refresh succeeds; calls `useLogout` (logout) on refresh failure.
│   └── firebase.js           // Firebase config for messaging and auth. Initializes Firebase app with env vars, exports `auth`, `provider` (GoogleAuthProvider), `storage`, and messaging helpers `getToken` and `onMessage`. Used by `useFirebaseMessaging` hook and other auth flows.
├── constants/                // Shared constants
│   └── index.js              // App-wide constants. Exports `PATH_NAME` (named route constants e.g., `ADMIN_DASHBOARD`, `ADMIN_HACKATHONS`, `PARTNER_HACKATHONS`, `JUDGE_TEAM_SCORES`) used by layouts and routes to build links and to determine selected menu keys. Also exports `GROUP`, a mapping used to group related PATH_NAME entries for fallback selection logic in layouts (for example maps hackathon-phase paths to tracks/criterias).
├── hooks/                    // Custom React hooks
│   ├── admin/                // Admin-specific hooks for each entity
│   │   ├── challanges/
│   │   │   ├── create.js         // [unuse] Create challenge logic (hook). Provides `useCreateChallenge` which submits a multipart/form-data payload to `/api/Challenge/create`. Constructs FormData (Title, Description, SeasonId, FilePath, file) and uses `axiosClient`. Uses React Query `useMutation` and Ant Design `message` for UI feedback.
│   │   │   ├── challenge-create.jsx  // [unuse] AdminChallengeCreate.jsx: manual admin form to create a challenge. Uses Ant Design Form with Upload dragger and delegates create logic to `useCreateChallenge` hook. Handles file selection (preventing auto-upload) and submits multipart payload via the hook.
│   │   │   └── useChallenges.js  // API call `useChallenges` hook: collection of data-fetching and mutation utilities for challenges. Exposes: `fetchChallenges` (useQuery for list), `fetchChallenge(id)` (useQuery for a single entity), `createChallenge` (mutation POST multipart), `updateChallenge` (PUT), `updateChallengeStatus` (PATCH), `deleteChallenge` (DELETE). Invalidates relevant query keys on success and shows Ant Design messages.
│   │   ├── criterias/
│   │   │   ├── detail/
│   │   │   │   └── index.jsx    // CriterionDetail: Admin view for a single criterion. Uses `useCriteria.fetchCriterionById` to load and `EntityDetail` to render fields (name, weight). Links back to track/phase routes and supports edit navigation.
│   │   │   └── useCriteria.js    // API call  Criteria data hook. Exposes `fetchCriteria(phaseId)` (useQuery for criteria list per phase), `fetchCriterionById(id)` (detail), `createCriterion` (mutation POST), `updateCriterion` (PUT), and `deleteCriterion` (DELETE). Uses axiosClient with query keys to invalidate lists/details appropriately and displays Ant Design messages on success/error.
│   │   ├── hackathon-phases/
│   │   │   └── useHackathonPhases.js // API call  Hackathon phase data hook. Exposes `fetchHackathonPhases(hackathonId)` (list by hackathon), `fetchHackathonPhase(id)` (detail), `createHackathonPhase`, `updateHackathonPhase`, and `deleteHackathonPhase`. Uses query keys to invalidate lists per hackathon and common messages for feedback.
│   │   ├── hackathons/
│   │   │   └── useHackathons.js  // API call  Hackathon data hook. Provides `fetchHackathons` (list), `fetchHackathon(id)`, `createHackathon`, `updateHackathon`, and `deleteHackathon`. Uses axiosClient and invalidates query keys after mutations.
│   │   ├── prizes/
│   │   │   └── usePrizes.js      // API call  Prizes data hook. Exposes `fetchPrizes(hackathonId)`, `createPrize`, `updatePrize`, and `deletePrize`. Fetches prizes for a hackathon and invalidates related caches after mutations.
│   │   ├── score/
│   │   │   └── useScore.js       // API call  Score data hook. Provides `fetchTeamScoresByGroup(groupId)`, `fetchMyScoresGrouped(phaseId)`, `createScore`, and `updateScore`. Handles scoring endpoints for judge and admin workflows; invalidates score caches after mutations and shows messages.
│   │   ├── seasons/
│   │   │   └── useSeasons.js     // API call  Seasons data hook. Provides `fetchSeasons`, `fetchSeason(id)`, `createSeason`, `updateSeason`, and `deleteSeason`. Uses axiosClient and invalidates caches after mutations.
│   │   ├── submission/
│   │   │   └── useSubmission.js  // API call  Submission data hook (file present but empty placeholder in repo) — intended to implement submission CRUD and listing for teams and partners.
│   │   ├── teams/
│   │   │   └── useTeams.js       // API call  Teams data hook. Provides `fetchTeams`, `fetchTeam(id)`, `createTeam`, `updateTeam`, `deleteTeam`. Uses axiosClient and invalidates lists and caches on mutations. Used in admin team management pages.
│   │   ├── tracks/
│   │   │   └── useTracks.js      // API call  Tracks data hook. Supports fetching tracks, creating/updating/deleting tracks, assigning random challenges and letting teams select a track. Exposes `fetchTracks`, `fetchTrackById`, `createTrack`, `updateTrack`, `deleteTrack`, `assignRandomChallenge`, and `selectTrackForTeam`.
│   │   └── users/
│   │       └── useUsers.js       // API call  Users data hook. Fetches user list (`GET /Auth/users`), updates user info, and toggles block/unblock state via `/Auth/users/{id}/block`. Invalidates user caches after mutations.
│   ├── useFirebaseMessaging.js   // API call  Firebase messaging hook. Requests notification permission, retrieves FCM token via `getToken(messaging, { vapidKey })` and logs it. Registers `onMessage` handler to show an alert when a foreground message arrives. Uses Vite env `VITE_WEBPUSH_CER` as VAPID key.
│   ├── useLogout.js              // API call  Logout hook. Returns a mutate function `mutateLogout` that calls the `logout` service, clears cookies/localStorage/query cache and redirects to `PATH_NAME.HOME`. Uses React Query mutation with onSuccess/onError handlers.
│   └── useUserData.js            // API call  User data hook. Uses React Query `useQuery` to call `getMe` when an access token is present in cookies. Returns `{ userInfo, isLoading, error, refetch }` where `userInfo` contains the API `data.data` payload.
├── index.css                  // Global CSS styles. Uses Tailwind CSS with custom utility classes for gradients, card backgrounds, hover glow, floating animation, and a grid pattern. These utilities are used across components for consistent styling.
├── main.jsx                   // React app bootstrap. Renders `<App />` into #root; StrictMode commented out.
├── pages/                     // Application pages by user role
│   ├── admin/
│   │   ├── challenge/
│   │   │   ├── index.jsx          // Challenge list page. Uses `useChallenges` to load data and renders `EntityTable` with a model-driven columns/actions. Supports create/edit/view/delete flows and confirmation modals for deletion.
│   │   │   ├── form/index.jsx     // Challenge create/edit form. Uses `CreateEditForm` with a model describing fields and calls `createChallenge` / `updateChallenge` mutations from `useChallenges`.
│   │   │   ├── challenge-create.jsx  // AdminChallengeCreate.jsx: manual admin form to create a challenge. Uses Ant Design Form with Upload dragger and delegates create logic to `useCreateChallenge` hook. Handles file selection (preventing auto-upload) and submits multipart payload via the hook.
│   │   │   └── detail/index.jsx   // Challenge detail page. Uses `EntityDetail` to render fields, supports file preview via Google Docs Viewer for document types, and exposes edit/back handlers.
│   │   ├── dashboard/
│   │   │   └── index.jsx          // Admin dashboard page: shows high-level stats (users, hackathons, submissions, pending reviews), recent activities, and system health. Uses Ant Design icons and static demo data; intended as admin landing UI for quick overview.
│   │   ├── hackathon/
│   │   │   ├── index.jsx          // Hackathon list page. Uses `useHackathons` to list hackathons and render `EntityTable` with actions (view/edit/delete) and quick buttons to manage phases/prizes.
│   │   │   ├── create-hackathon-form/index.jsx // Multi-step wizard for creating a hackathon. Uses internal state for steps, prizes, stages and uses UI components (Input, Select, DatePicker) to collect configuration. Submits demo data (alert) currently; intended to call `createHackathon`.
│   │   │   ├── form/index.jsx     // Hackathon create/edit form. Model-driven `CreateEditForm` that depends on `useSeasons` for season options and uses `useHackathons` mutations to create/update entities.
│   │   │   └── detail/index.jsx   // Hackathon detail page. Uses `EntityDetail` to render hackathon info and custom value renderers for status and dates.
│   │   ├── phases/
│   │   │   ├── form/
│   │   │   │   └── index.jsx      // Phase form page. Uses `CreateEditForm` with model-driven fields for phase properties. Integrates `useHackathonPhases` for CRUD operations.
│   │   │   └── index.jsx          // Phase list page. Displays phases for a hackathon using `EntityTable`. Supports create/edit/delete and toggles for visibility and status.
│   │   ├── prizes/
│   │   │   ├── form/
│   │   │   │   └── index.jsx      // Prize form page. Uses `CreateEditForm` for prize properties. Integrates `usePrizes` for create/update operations.
│   │   │   └── index.jsx          // Prize list page. Displays prizes for a hackathon using `EntityTable`. Supports create/edit/delete and visibility toggles. Uses `usePrizes` and `useHackathons`.
│   │   │   ├── prize-form/index.jsx // Prize form page. Uses `CreateEditForm` for prize properties and submits via `usePrizes` create/update mutations. Reads `hackathonId` from query params.
│   │   │   └── prize-detail/index.jsx // Prize detail page. Renders prize data using `EntityDetail` (fetches list and selects by id), provides edit/back actions.
│   │   ├── score/
│   │   │   └── index.jsx          // Score management page. Displays scores for teams in a hackathon. Integrates `useScore` for fetching and updating scores.
│   │   ├── seasons/
│   │   │   ├── form/
│   │   │   │   └── index.jsx      // Season form page. Uses `CreateEditForm` for season properties. Integrates `useSeasons` for CRUD operations.
│   │   │   └── index.jsx          // Season list page. Displays seasons for a hackathon using `EntityTable`. Supports create/edit/delete and toggles for active status.
│   │   ├── team/
│   │   │   ├── detail/
│   │   │   │   └── index.jsx      // Team detail page. Uses `EntityDetail` to render team info. Read-only; shows leader, chapter, and createdAt.
│   │   │   └── index.jsx          // Team list page. Renders `EntityTable` listing teams with view and delete actions. Uses `useTeams` hook.
│   │   └── users/
│   │       └── index.jsx          // User management page. Displays list of users with roles and statuses. Integrates `useUsers` for fetching and updating user data.
│   ├── landing/
│   │   └── index.jsx              // Landing page: marketing site with sections (features, hackathons, timeline, FAQ) and a modal login dialog that delegates to `Login` component and `loginGoogle` service. Uses AOS for scroll animations and Tailwind styling. Handles login mutation to store tokens and redirect based on role claim in JWT.
│   ├── notfound/
│   │   └── index.jsx              // 404 page: simple user-friendly not found landing with link back to home.
│   ├── member/
│   │   └── index.jsx              // Member page: placeholder component `MemberHome` (can be expanded).
│   ├── notfound/
│   │   └── index.jsx              // 404 Not Found page
│   └── partner/
│       ├── challenge/
│       │   ├── index.jsx          // Partner challenge list page: similar to admin challenge list but scoped for partner users. Uses `useChallenges` and EntityTable. Supports create/edit/view/delete for partner-owned challenges.
│       │   ├── form/index.jsx     // Partner challenge form page: Partner-facing create/edit form for challenges using `CreateEditForm` and `useChallenges`.
│       │   └── detail/index.jsx   // Partner challenge detail page: shows challenge details and files like admin detail page.
│       ├── hackathon/
│       │   ├── index.jsx          // Partner hackathon list page: lists hackathons partner can participate in, view phases/prizes via UI buttons. Uses `useHackathons`.
│       │   └── detail/index.jsx    // Partner hackathon detail page: partner-facing view of hackathon details (not expanded here).
│       └── score/
│           ├── index.jsx          // Partner phase score page: same UI as judge/member but scoped to partner's teams. Uses `useScore` to fetch and update scores.
│           └── detail/index.jsx    // Partner score detail page: view/edit single submission score (not fully documented here).
├── routes/                    // Application route definitions
│   ├── AdminRoutes.jsx        // Admin routes wrapper: uses `useUserData` to check auth and conditionally renders `AdminLayout` with `<Outlet />`. Returns a loading spinner while user data is loading. (Note: `isAdmin` is currently hardcoded true in source; replace comment indicates real role check should use `userInfo`.)
│   ├── GuestRoute.jsx         // Guest route wrapper: simple wrapper that redirects authenticated users to home, otherwise renders Outlet for guest pages.
│   ├── index.jsx              // Main route tree. Uses React Router `createBrowserRouter` to define public (Landing), Member, Admin, Partner, and Judge routes. Many admin/partner/judge pages are lazy-loaded with Suspense/Spin fallback via `withSuspense` helper. Routes reference `PATH_NAME` constants for base paths.
│   ├── JudgeRoutes.jsx        // Judge routes wrapper: similar to AdminRoutes, uses `useUserData` and renders `JudgeLayout` when authenticated as judge (currently `isJudge` is hardcoded true).
│   ├── MemberRoutes.jsx       // Member routes wrapper: checks `userInfo.roleId === 1` to allow access; otherwise redirects to NotFound.
│   └── PartnerRoutes.jsx      // Partner routes wrapper: uses `useUserData` and renders `PartnerLayout` when authenticated as partner (currently `isPartner` is hardcoded true).
├── services/
│   └── auth.js                // Authentication service. Exposes `loginGoogle(payload)`, `getMe()`, `logout()`, and `callRefreshToken(payload)` that call corresponding `/Auth` endpoints via `axiosClient`.
├── store/                     // Global state management
│   ├── hooks/
│   │   ├── useAuthStore.js        // (placeholder) intended to expose auth store selectors. Project uses `useStore` directly from `src/store/index.js`.
│   │   └── useUserStore.js        // Exposes helper `useUserStore()` which selects `state.user` from the Zustand store.
│   ├── index.js                  // Store entry point. Creates a persistent Zustand store using `createAuthSlice` persisted to localStorage under `app-storage`. Partially persists only `user` and `isAuthenticated`.
│   └── slices/
│       └── authSlice.js          // Auth slice factory `createAuthSlice(set)` returning state and actions: `user`, `isAuthenticated`, `isLoading`, `error`, `setUser(user)`, `startLoading()`, `logout()`.
└── utils/
    └── index.js              // Utility functions: exports `notify(type, {description, duration})` which wraps Ant Design `notification` with localized default titles and safe validation of types ('info','success','error','warning').
```

---

## Component & Module Descriptions

- **App.jsx**: The main entry point for the React application, bootstraps the app.
- **assets/**: Contains static files such as images and icons used throughout the app.
- **components/**: Houses all reusable UI components, layouts for different user roles, and form elements.
- **configs/**: Configuration files for HTTP client (axios) and Firebase integration.
- **constants/**: Centralized constants for paths, groups, and other shared values.
- **hooks/**: Custom React hooks for business logic, including admin hooks for each entity and general hooks for messaging, logout, and user data, API call with use query.
- **pages/**: Main application pages, organized by user role (admin, judge, partner, etc.), each with subpages for CRUD operations and details.
- **routes/**: Route definitions for each user role, controlling navigation and access.
- **services/**: API service modules, such as authentication.
- **store/**: State management using hooks and slices, powered by Redux or Zustand.
- **utils/**: Utility functions shared across the application.

---

*Document generated on November 24, 2025.*

## API Documentation
API documentation can be found in the `https://www.sealfall25.somee.com/swagger/index.html` page.
To authenticate use api GET `/api/Auth/users` add email from this API's response to POST `/api/Auth/login-google-test-BE` get accessToken then use it to call other APIs.
Note: storage accessToken to file for reuse in other API calls.
