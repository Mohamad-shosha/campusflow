import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const htmlDir = path.join(import.meta.dirname, 'html');
const pdfDir = path.join(import.meta.dirname, 'pdf');
const edge = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
].find(existsSync);

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (a, ord) => ((a && a.length) ? `<${ord ? 'ol' : 'ul'}>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>` : '<p class="muted">None</p>');
const dep = (t) => ((t.deps && t.deps.length) ? t.deps.join(', ') : 'None');

export const phases = {
  P0: 'Discovery & Strategic Planning',
  P1: 'Foundations & DevOps Infrastructure',
  P2: 'Identity, Security & Campus Core',
  P3: 'Frontend Architecture (React 19 + TypeScript)',
  P4: 'Financial Ledger & Tuition Offset Engine',
  P5: 'Smart Parking & ALPR Computer Vision Gate',
  P6: 'Academic Campus Services & Resource Pods',
  P7: 'Notifications, Governance & Telemetry Analytics',
  P8: 'Security Hardening, Compliance & Quality Assurance',
  P9: 'Production Deployment, CI/CD & Operations',
};

export const tasks = [
  {
    id: 'P0-01',
    title: 'Project Discovery, Architecture Blueprint & Technical Planning',
    status: 'Done',
    pr: 'Merged into main (3df8350)',
    branch: 'docs/P0-01-project-discovery',
    pri: 'Critical',
    cx: 'L',
    deps: [],
    goal: 'Exhaustive exploration and technical documentation of existing assets: Architectural audit, UI inventory, PRD, user journey flows, modular monolith architecture, database ERD, MVP scope, delivery roadmap, and risk register.',
    files: ['plan.md', 'TASKS.md', 'docs/discovery/*', 'docs/architecture/*', 'docs/decisions/*'],
    steps: [
      'Perform detailed audit of existing codebase, legacy prototypes, and git history.',
      'Establish baseline build stability and verify asset integrity.',
      'Author architectural blueprints, decision records (ADRs), and database ERDs.',
      'Formulate comprehensive delivery plan.md and master engineering backlog TASKS.md.'
    ],
    accept: [
      'All technical specifications are consistent, complete, and peer-reviewed.',
      'Baseline project builds cleanly with zero missing dependencies.'
    ],
    tests: ['npm run build validation test passed'],
    blockedBy: []
  },
  {
    id: 'P1-01',
    title: 'Monorepo Architecture Restructure & Design Showcase Preservation',
    status: 'Done',
    pr: 'PR (chore/P1-01-repo-restructure)',
    branch: 'chore/P1-01-repo-restructure',
    pri: 'High',
    cx: 'M',
    deps: ['P0-01 Approved'],
    goal: 'Restructure codebase into an enterprise monorepo layout (frontend/, backend/, design-system/, docs/, public/), preserve the 18-section Figma master showcase and 16:9 executive pitch deck, and eliminate asset duplication.',
    files: ['design-system/**', 'frontend/', 'backend/', '.gitignore', 'README.md', 'vite.config.js'],
    steps: [
      'Execute git mv operations to cleanly migrate files while preserving complete commit history.',
      'Resolve and update all relative asset paths across HTML, CSS, and JS files.',
      'Clean obsolete development server hooks in root bundler configuration.',
      'Establish global public assets directory and deduplicate 50MB of presentation slides.'
    ],
    accept: [
      'Zero file or commit history loss throughout repository migration.',
      'Design system showcase and presentation decks render with 100% visual fidelity.',
      'Clean root directory containing only root configuration and domain folders.'
    ],
    tests: ['Vite build validation', 'Asset URL resolution checks', 'Git status cleanliness audit'],
    blockedBy: []
  },
  {
    id: 'P1-02',
    title: 'Frontend Application Scaffold (React 19 + TypeScript Strict)',
    status: 'Done',
    pr: 'PR (feature/P1-02-frontend-scaffold)',
    branch: 'feature/P1-02-frontend-scaffold',
    pri: 'High',
    cx: 'M',
    deps: ['P1-01', 'ADR-0002'],
    goal: 'Initialize high-performance React 19 + TypeScript production application in frontend/ with strict typechecking, ESLint 9, Prettier, and Vitest testing suite.',
    files: ['frontend/package.json', 'frontend/tsconfig.json', 'frontend/vite.config.ts', 'frontend/eslint.config.js', 'frontend/src/**'],
    steps: [
      'Bootstrap React 19 + TypeScript project using Vite 6.',
      'Configure strict TypeScript compiler options and ESLint Flat Config.',
      'Configure Vitest testing environment with React Testing Library and jsdom.',
      'Establish enterprise folder architecture (app/, features/, shared/, styles/).',
      'Implement standardized scripts: dev, build, lint, format, typecheck, test.'
    ],
    accept: [
      'All npm scripts (build, lint, typecheck, test) execute with zero warnings or errors.',
      'Unit test suite passes with jsdom environment configured.'
    ],
    tests: ['npm run lint', 'npm run typecheck', 'npm run test', 'npm run build'],
    blockedBy: []
  },
  {
    id: 'P1-03',
    title: 'Backend Core Modular Monolith Skeleton (Spring Boot 3.3, Java 21 LTS)',
    status: 'Done',
    pr: 'PR (feature/P1-03-backend-skeleton)',
    branch: 'feature/P1-03-backend-skeleton',
    pri: 'High',
    cx: 'M',
    deps: ['P1-01', 'ADR-0001'],
    goal: 'Bootstrap Spring Boot 3.3 modular monolith with Java 21 LTS virtual threads, Actuator telemetry, SpringDoc OpenAPI/Swagger, RFC 7807 ProblemDetail exception handling, and ArchUnit architecture governance.',
    files: ['backend/pom.xml', 'backend/src/main/java/.../common/**', 'backend/src/main/resources/application*.yml', 'backend/src/test/**'],
    steps: [
      'Initialize Maven multi-module structure with Java 21 and Spring Boot 3.3.4.',
      'Implement GlobalExceptionHandler emitting RFC 7807 ProblemDetail responses.',
      'Configure SpringDoc OpenAPI with Swagger UI at /swagger-ui/index.html.',
      'Configure application profiles (dev, test, prod) with isolated configurations.',
      'Define and enforce ArchUnit architecture rules preventing illegal cross-module dependencies.'
    ],
    accept: [
      'Backend starts successfully on port 8080 with Actuator health endpoint UP.',
      'Swagger UI loads at /swagger-ui/index.html.',
      'Validation failures return standard RFC 7807 problem responses with localized error messages.'
    ],
    tests: ['GlobalExceptionHandlerTest', 'ArchUnitTest', 'ContextLoadTest', 'Maven verify'],
    blockedBy: []
  },
  {
    id: 'P1-04',
    title: 'PostgreSQL Persistence, Flyway Migrations & Testcontainers Harness',
    status: 'Done',
    pr: 'PR (feature/P1-04-database-flyway)',
    branch: 'feature/P1-04-database-flyway',
    pri: 'High',
    cx: 'M',
    deps: ['P1-03'],
    goal: 'Establish PostgreSQL database connectivity, Flyway migration versioning (V1 baseline), and abstract Testcontainers integration test harness for real database testing.',
    files: ['backend/pom.xml', 'backend/src/main/resources/db/migration/V1__baseline.sql', 'application.yml', 'AbstractIntegrationTest.java'],
    steps: [
      'Add Spring Data JPA, PostgreSQL JDBC driver, and Flyway migration dependencies.',
      'Configure HikariCP connection pool with environment variable overrides.',
      'Author V1__baseline.sql migration enabling pgcrypto and btree_gist extensions.',
      'Configure Hibernate with ddl-auto=validate to enforce Flyway authority.',
      'Create AbstractIntegrationTest spinning up reusable Testcontainers PostgreSQL instance.'
    ],
    accept: [
      'Flyway migrations execute cleanly on clean database.',
      'Subsequent boots validate existing schema without schema drift.',
      'Integration tests run against real containerized PostgreSQL.'
    ],
    tests: ['Flyway baseline migration test', 'Testcontainers repository integration tests'],
    blockedBy: []
  },
  {
    id: 'P1-05',
    title: 'Containerization, Docker Compose Orchestration & Health Checks',
    status: 'Done',
    pr: 'PR (feature/P1-05-docker-compose)',
    branch: 'feature/P1-05-docker-compose',
    pri: 'High',
    cx: 'M',
    deps: ['P1-02', 'P1-03', 'P1-04'],
    goal: 'Deliver unified single-command full-stack containerization: Multi-stage Dockerfiles for backend and frontend (Nginx), PostgreSQL with persistent volumes, and health-check dependency ordering.',
    files: ['backend/Dockerfile', 'frontend/Dockerfile', 'frontend/nginx.conf', 'docker-compose.yml', '.env.example', 'docs/runbooks/local-development.md'],
    steps: [
      'Create multi-stage builder Dockerfile for Spring Boot with non-root runtime user.',
      'Create multi-stage builder Dockerfile for React SPA with Nginx reverse proxy to /api.',
      'Configure docker-compose.yml with postgres, backend, and frontend services on fbsu-network.',
      'Configure container health checks with depends_on condition: service_healthy.',
      'Author .env.example and comprehensive local development runbook.'
    ],
    accept: [
      'docker compose up boots all 3 containers to healthy state.',
      'Frontend serves UI on port 80; Backend responds on port 8080.',
      'Data persists in named volume across container restarts.'
    ],
    tests: ['docker build validation', 'compose startup verification', 'healthcheck validation', 'volume persistence test'],
    blockedBy: []
  },
  {
    id: 'P1-06',
    title: 'Continuous Integration Pipeline (GitHub Actions CI)',
    status: 'Done',
    pr: 'PR (ci/P1-06-github-actions)',
    branch: 'ci/P1-06-github-actions',
    pri: 'High',
    cx: 'M',
    deps: ['P1-05'],
    goal: 'Establish enterprise CI workflow: Automated frontend quality checks, backend Maven verification, Docker builds, and compose smoke testing with PR template and Dependabot.',
    files: ['.github/workflows/ci.yml', '.github/pull_request_template.md', '.github/dependabot.yml'],
    steps: [
      'Author frontend CI job (npm ci, lint, typecheck, vitest, build).',
      'Author backend CI job (Java 21 setup, ArchUnit tests, unit tests, JAR packaging).',
      'Author Docker verification job validating compose configuration and building test images.',
      'Configure standardized GitHub Pull Request template and automated Dependabot scans.'
    ],
    accept: [
      'All CI pipeline jobs execute and report green status on PRs.',
      'Failing unit or architecture tests block merge automatically.'
    ],
    tests: ['GitHub Actions automated CI runner verification'],
    blockedBy: []
  },
  {
    id: 'P2-01',
    title: 'Campus Core Schema (University Tenant, College, Building, Term)',
    status: 'Done',
    pr: 'PR (feature/P2-01-campus-schema)',
    branch: 'feature/P2-01-campus-schema',
    pri: 'High',
    cx: 'M',
    deps: ['P1-04', 'ADR-0003'],
    goal: 'Database schema and JPA entities for institutional tenancy: Universities, colleges, buildings, and academic terms with strict university_id multi-tenancy enforcement.',
    files: ['backend/src/main/resources/db/migration/V2__campus.sql', 'campus/domain/*', 'campus/infra/*Repository.java'],
    steps: [
      'Author V2__campus.sql migration creating university, college, building, and academic_term tables.',
      'Implement BaseTenantEntity providing audit timestamps and tenant partitioning.',
      'Create JPA entity models and Spring Data JPA repository interfaces.',
      'Implement repository integration tests with Testcontainers verifying constraints.'
    ],
    accept: [
      'Tables and foreign keys created with unique institutional code constraints.',
      'Repository tests pass against containerized PostgreSQL.'
    ],
    tests: ['CampusRepositoryIntegrationTest', 'Flyway migration test'],
    blockedBy: []
  },
  {
    id: 'P2-02',
    title: 'Identity, Security Roles & Vehicles Domain Schema',
    status: 'Done',
    pr: 'PR (feature/P2-02-users-schema)',
    branch: 'feature/P2-02-users-schema',
    pri: 'High',
    cx: 'M',
    deps: ['P2-01'],
    goal: 'User account management, security roles (RBAC), vehicle registrations, and refresh token tables with BCrypt hashing and Saudi license plate validation.',
    files: ['backend/src/main/resources/db/migration/V3__identity.sql', 'identity/domain/*', 'identity/infra/*'],
    steps: [
      'Author V3__identity.sql migration creating app_user, user_role, vehicle, and refresh_token tables.',
      'Implement User, Role, and Vehicle domain entities with bidirectional relationship mappings.',
      'Create SaudiPlate value object with strict regex validation (3 Arabic letters + 1-4 digits).',
      'Implement PasswordService using BCrypt with cost factor 12.',
      'Write exhaustive unit tests for SaudiPlate parsing and PasswordService hashing.'
    ],
    accept: [
      'University user ID and Saudi license plate unique per university tenant.',
      'BCrypt salted password hashes verified; invalid plates rejected.'
    ],
    tests: ['SaudiPlateTest', 'PasswordServiceTest', 'IdentityRepositoryIntegrationTest'],
    blockedBy: []
  },
  {
    id: 'P2-03',
    title: 'Authentication API (Register, Login, Refresh, Logout) & RBAC',
    status: 'Done',
    pr: 'PR (feature/P2-03-authentication)',
    branch: 'feature/P2-03-authentication',
    pri: 'Critical',
    cx: 'L',
    deps: ['P2-02'],
    goal: 'Stateless JWT authentication engine with 15-minute access tokens, rotating refresh tokens, role-based authorization guards, and endpoint rate limiting.',
    files: ['common/security/*', 'identity/api/AuthController.java', 'identity/application/AuthService.java', 'DTOs', 'tests'],
    steps: [
      'Configure Spring Security with stateless session management and JWT authentication filter.',
      'Implement JwtService supporting HMAC-SHA256 signature verification and expiration handling.',
      'Implement AuthService handling registration, credential validation, token rotation, and revocation.',
      'Create AuthController exposing /api/v1/auth/ endpoints with OpenAPI documentation.',
      'Author security test suite verifying authentication matrix and token tampering prevention.'
    ],
    accept: [
      'Registration creates user and registers initial vehicle atomically.',
      'Invalid credentials return 401 Unauthorized without user enumeration.',
      'Expired or tampered JWTs rejected immediately; refresh rotation revokes previous tokens.'
    ],
    tests: ['AuthServiceTest', 'AuthControllerIntegrationTest', 'SecurityMatrixTest', 'TokenTamperTest'],
    blockedBy: []
  },
  {
    id: 'P2-04',
    title: 'User Profile & Vehicle Registration Management API',
    status: 'In Progress',
    pr: 'feature/P2-04-profile-vehicles-api',
    branch: 'feature/P2-04-profile-vehicles-api',
    pri: 'Medium',
    cx: 'M',
    deps: ['P2-03'],
    goal: 'Self-service API enabling authenticated students and faculty to retrieve and update profiles and register, update, and manage campus vehicles with IDOR protection.',
    files: ['identity/api/MeController.java', 'identity/application/*', 'DTOs', 'tests'],
    steps: [
      'Implement ProfileService and VehicleService application logic.',
      'Create MeController and VehicleController with DTO request/response contracts.',
      'Enforce security ownership checks ensuring users can access only their own vehicles.',
      'Author comprehensive unit and MockMvc integration tests.'
    ],
    accept: [
      'Users can view and edit only their own profile and vehicles (zero IDOR vulnerability).',
      'Validation errors emit standard RFC 7807 problem details.'
    ],
    tests: ['ProfileServiceTest', 'VehicleControllerTest', 'IdorSecurityTest'],
    blockedBy: []
  },
  {
    id: 'P2-05',
    title: 'Development & Demonstration Seed Data Fixture',
    status: 'Backlog',
    pr: 'feature/P2-05-dev-seed',
    branch: 'feature/P2-05-dev-seed',
    pri: 'Low',
    cx: 'S',
    deps: ['P2-03'],
    goal: 'Idempotent seed data loader providing realistic FBSU colleges, buildings, parking spots, faculty, and student personas exclusively in dev profile.',
    files: ['backend/.../DevSeeder.java', 'seed resources'],
    steps: [
      'Implement DevSeeder component activated strictly under @Profile("dev").',
      'Ensure idempotent upsert logic to prevent duplicate records across multiple boots.',
      'Validate that seeding is completely bypassed in production profile.'
    ],
    accept: [
      'Executes seamlessly in dev profile without errors.',
      'Multiple application restarts produce identical, deduplicated database state.'
    ],
    tests: ['DevSeederIntegrationTest verifying profile isolation'],
    blockedBy: []
  },
  {
    id: 'P3-01',
    title: 'Design Tokens, Global CSS & Application Shell',
    status: 'Backlog',
    pr: 'feature/P3-01-app-shell',
    branch: 'feature/P3-01-app-shell',
    pri: 'High',
    cx: 'L',
    deps: ['P1-02'],
    goal: 'Port design tokens, brand fonts, and styling into React AppShell with Header, Navigation, Footer, and Router matching the master Figma showcase.',
    files: ['frontend/src/styles/*', 'frontend/src/app/*', 'frontend/src/shared/layout/*'],
    steps: [
      'Migrate CSS variable tokens (--fbsu-teal, --fbsu-gold) and fonts into React styles.',
      'Build responsive AppShell, TopNav, Dropdowns, and Institutional Footer.',
      'Configure React Router with core layout routes and error boundaries.',
      'Capture visual regression screenshot baselines across desktop and mobile viewports.'
    ],
    accept: [
      'Visual parity confirmed against master design showcase in both dark and light modes.',
      'Zero layout shifts across desktop, tablet, and mobile displays.'
    ],
    tests: ['Component unit tests', 'Playwright responsive visual verification'],
    blockedBy: []
  },
  {
    id: 'P3-02',
    title: 'Internationalization (AR/EN), RTL/LTR Switching & Theme Toggle',
    status: 'Backlog',
    pr: 'feature/P3-02-i18n-theme',
    branch: 'feature/P3-02-i18n-theme',
    pri: 'High',
    cx: 'M',
    deps: ['P3-01'],
    goal: 'Bilingual internationalization engine (Arabic/English) via react-i18next with bidirectional RTL/LTR layout adaptation and persisted theme toggle.',
    files: ['frontend/src/shared/i18n/*', 'locales/ar.json', 'locales/en.json', 'ThemeToggle/LangToggle'],
    steps: [
      'Extract all interface strings into structured ar.json and en.json translation catalogs.',
      'Configure I18nextProvider with dynamic document dir and lang attribute updates.',
      'Implement ThemeToggle (dark/light) with local storage persistence.',
      'Write tests verifying dynamic language and direction switching.'
    ],
    accept: [
      'Zero hardcoded strings in application shell.',
      'Document direction toggles between rtl and ltr seamlessly without broken layouts.'
    ],
    tests: ['I18n unit tests', 'Playwright bilingual switching test'],
    blockedBy: []
  },
  {
    id: 'P3-03',
    title: 'Typed API Client, Auth Context & Route Guards',
    status: 'Backlog',
    pr: 'feature/P3-03-api-client-auth-context',
    branch: 'feature/P3-03-api-client-auth-context',
    pri: 'High',
    cx: 'M',
    deps: ['P3-01', 'P2-03'],
    goal: 'Typed HTTP client with Axios, TanStack Query integration, AuthContext provider, automated JWT token refresh interceptors, and protected route guards.',
    files: ['frontend/src/shared/http/*', 'frontend/src/features/auth/*'],
    steps: [
      'Create configured Axios client with automatic Authorization header injection.',
      'Implement token refresh interceptor on 401 responses with queued request replay.',
      'Build AuthProvider managing user session, roles, and login/logout state.',
      'Implement ProtectedRoute and RoleGuard components for declarative authorization.'
    ],
    accept: [
      '401 response triggers token refresh once then logs out on failure.',
      'Unauthorized access attempts redirect cleanly to login with return path preserved.'
    ],
    tests: ['HTTP interceptor tests', 'MSW mock integration tests', 'Route guard tests'],
    blockedBy: []
  },
  {
    id: 'P3-04',
    title: 'Authentication UI (Login & Registration Flow)',
    status: 'Backlog',
    pr: 'feature/P3-04-auth-ui',
    branch: 'feature/P3-04-auth-ui',
    pri: 'High',
    cx: 'M',
    deps: ['P3-03', 'P2-03'],
    goal: 'User-friendly login and registration forms featuring Zod schema validation, API wiring, error notifications, and removal of quick-login development bypasses.',
    files: ['frontend/src/features/auth/*'],
    steps: [
      'Build LoginForm and RegisterForm components matching Figma specifications.',
      'Implement client-side validation using Zod and React Hook Form.',
      'Wire forms to AuthService and handle server error feedback.',
      'Ensure accessible keyboard navigation and ARIA attributes.'
    ],
    accept: [
      'Instant field-level validation feedback on invalid inputs.',
      'Successful login/registration persists authentication session and redirects.'
    ],
    tests: ['Form validation tests', 'Auth API integration tests', 'Playwright login flow'],
    blockedBy: []
  },
  {
    id: 'P3-05',
    title: 'Shared UI Component Kit (Modal, Toast, Badge, Button, SaudiPlate, QR)',
    status: 'Backlog',
    pr: 'feature/P3-05-ui-kit',
    branch: 'feature/P3-05-ui-kit',
    pri: 'Medium',
    cx: 'M',
    deps: ['P3-01'],
    goal: 'Reusable atomic component library: Modal with focus-trap, Toast notification manager, Badge, Button, FormField, SaudiPlate renderer, and QR code generator.',
    files: ['frontend/src/shared/ui/*'],
    steps: [
      'Implement atomic components matching design system token definitions.',
      'Implement accessible Modal component with focus trap and escape key listeners.',
      'Implement SaudiPlate component rendering official Saudi plate layout with Arabic lettering.',
      'Perform automated accessibility audit using axe-core.'
    ],
    accept: [
      'All interactive components fully operable via keyboard.',
      'Zero accessibility violations reported by axe-core.'
    ],
    tests: ['Component unit tests', 'Axe accessibility compliance tests'],
    blockedBy: []
  },
  {
    id: 'P4-01',
    title: 'Financial Ledger & Wallet Database Schema',
    status: 'Backlog',
    pr: 'feature/P4-01-ledger-schema',
    branch: 'feature/P4-01-ledger-schema',
    pri: 'High',
    cx: 'M',
    deps: ['P2-03'],
    goal: 'Append-only double-entry financial ledger schema and student wallet tables with mathematical constraints guaranteeing non-negative balances.',
    files: ['backend/src/main/resources/db/migration/V4__wallet.sql', 'wallet/domain/*', 'wallet/infra/*'],
    steps: [
      'Author V4__wallet.sql migration creating wallet and ledger_entry tables.',
      'Apply CHECK (balance >= 0) constraint on wallet balances.',
      'Implement optimistic locking (@Version) on Wallet entity to prevent race conditions.',
      'Create WalletRepository and LedgerEntryRepository interfaces.'
    ],
    accept: [
      'Negative balance operations physically rejected by PostgreSQL engine.',
      'Idempotency key uniqueness constraint enforced on all financial transactions.'
    ],
    tests: ['WalletRepositoryIntegrationTest', 'PostgreSQL constraint validation tests'],
    blockedBy: []
  },
  {
    id: 'P4-02',
    title: 'Wallet Service & Transaction Operations API',
    status: 'Backlog',
    pr: 'feature/P4-02-wallet-api',
    branch: 'feature/P4-02-wallet-api',
    pri: 'Critical',
    cx: 'L',
    deps: ['P4-01'],
    goal: 'Enterprise financial engine: Real-time balance inquiry, paginated transaction statement, atomic peer-to-peer transfers, and idempotent payment handling.',
    files: ['wallet/application/*', 'wallet/api/*', 'tests'],
    steps: [
      'Implement WalletService supporting credit, debit, and atomic transfer methods.',
      'Implement Idempotency-Key header filter guaranteeing safe retry semantics.',
      'Create WalletController exposing /api/v1/wallet/ endpoints with OpenAPI documentation.',
      'Execute multi-threaded stress tests to verify race condition resilience.'
    ],
    accept: [
      'Peer-to-peer transfers execute atomically inside a single database transaction.',
      'Zero double-spending under concurrent multi-threaded requests.'
    ],
    tests: ['WalletServiceTest', 'ConcurrentTransferStressTest', 'WalletControllerTest'],
    blockedBy: []
  },
  {
    id: 'P4-03',
    title: 'Tuition Account Management & Automatic Fee Offset API',
    status: 'Backlog',
    pr: 'feature/P4-03-tuition',
    branch: 'feature/P4-03-tuition',
    pri: 'High',
    cx: 'L',
    deps: ['P4-02'],
    goal: 'Academic term tuition invoice accounts, automated credit offset from peer tutoring earnings, and unique fiscal receipt number generation.',
    files: ['backend/src/main/resources/db/migration/V5__tuition.sql', 'wallet/application/Tuition*', 'wallet/api/*'],
    steps: [
      'Author V5__tuition.sql migration creating tuition_account and payment_receipt tables.',
      'Implement TuitionService executing atomic tuition payment via wallet balance offset.',
      'Implement sequential institutional receipt number generator.',
      'Create TuitionController and DTOs with OpenAPI documentation.'
    ],
    accept: [
      'Offset amount cannot exceed available wallet balance or remaining invoice due.',
      'Receipt numbers are globally unique, sequential, and immutable.'
    ],
    tests: ['TuitionServiceTest', 'ReceiptGenerationTest', 'TuitionControllerTest'],
    blockedBy: []
  },
  {
    id: 'P4-04',
    title: 'Student Wallet UI Dashboard',
    status: 'Backlog',
    pr: 'feature/P4-04-wallet-ui',
    branch: 'feature/P4-04-wallet-ui',
    pri: 'Medium',
    cx: 'M',
    deps: ['P3-04', 'P4-02'],
    goal: 'Interactive wallet interface presenting current SAR balance, categorized transaction ledger history, and tutoring earnings breakdown.',
    files: ['frontend/src/features/wallet/*'],
    steps: [
      'Build WalletDashboard with balance card, quick actions, and filterable history table.',
      'Wire components to Wallet API using TanStack Query.',
      'Implement skeleton loading states and empty state indicators.',
      'Verify responsiveness on mobile and desktop viewports.'
    ],
    accept: [
      'Exact visual parity with master Figma design system.',
      'Real-time balance updates accurately reflect server state.'
    ],
    tests: ['WalletDashboard component tests', 'E2E wallet transaction flow'],
    blockedBy: []
  },
  {
    id: 'P4-05',
    title: 'Tuition Payment & Digital Receipt UI',
    status: 'Backlog',
    pr: 'feature/P4-05-tuition-ui',
    branch: 'feature/P4-05-tuition-ui',
    pri: 'Medium',
    cx: 'M',
    deps: ['P4-03', 'P4-04'],
    goal: 'Tuition fee payment interface, credit offset modal, and printable official institutional payment receipt with validation QR code.',
    files: ['frontend/src/features/tuition/*'],
    steps: [
      'Build TuitionOverview displaying current term fees and pending balance.',
      'Implement payment modal allowing partial or full offset from wallet earnings.',
      'Build printable official institutional receipt view with formatted print CSS.',
      'Test complete payment flow end-to-end.'
    ],
    accept: [
      'Accurate balance calculation preventing invalid payment attempts.',
      'Receipt prints cleanly on A4 with university header and validation code.'
    ],
    tests: ['TuitionForm validation tests', 'Receipt print CSS test', 'Playwright payment flow'],
    blockedBy: []
  },
  {
    id: 'P5-01',
    title: 'Parking Domain Schema (Zones, Spots, Assignments, Tariffs)',
    status: 'Backlog',
    pr: 'feature/P5-01-parking-schema',
    branch: 'feature/P5-01-parking-schema',
    pri: 'High',
    cx: 'M',
    deps: ['P2-01'],
    goal: 'Database schema for campus parking zones, 30 monitored spots, vehicle permits, and dynamic hourly parking tariff schedules.',
    files: ['backend/src/main/resources/db/migration/V6__parking.sql', 'parking/domain/*'],
    steps: [
      'Author V6__parking.sql migration creating parking_zone, parking_spot, and tariff tables.',
      'Create Zone, Spot, and Tariff JPA entities and repositories.',
      'Seed baseline definitions for 30 monitored campus spots across North and South zones.',
      'Validate foreign keys and constraints.'
    ],
    accept: [
      'Spot numbering unique per zone.',
      'Tariff schedules support dynamic hourly rates and faculty exemption rules.'
    ],
    tests: ['ParkingRepositoryTest', 'Flyway migration test'],
    blockedBy: []
  },
  {
    id: 'P5-02',
    title: 'Parking Spots & Zones Real-Time Query API',
    status: 'Backlog',
    pr: 'feature/P5-02-spots-api',
    branch: 'feature/P5-02-spots-api',
    pri: 'High',
    cx: 'M',
    deps: ['P5-01'],
    goal: 'High-performance read API delivering real-time spot occupancy status with zone, status, and accessibility filtering.',
    files: ['parking/api/*', 'parking/application/*'],
    steps: [
      'Implement SpotService with optimized projection queries for rapid grid rendering.',
      'Create SpotController exposing /api/v1/parking/spots with filter parameters.',
      'Implement zone aggregate statistics endpoint (total, available, occupied).',
      'Author API integration tests.'
    ],
    accept: [
      'Accurate status filtering (Available, Occupied, Reserved, Maintenance).',
      'Sub-50ms API response time under concurrent read load.'
    ],
    tests: ['SpotServiceTest', 'SpotControllerMockMvcTest'],
    blockedBy: []
  },
  {
    id: 'P5-03',
    title: 'Parking Reservation Engine & Digital Pass Generation',
    status: 'Backlog',
    pr: 'feature/P5-03-parking-booking',
    branch: 'feature/P5-03-parking-booking',
    pri: 'Critical',
    cx: 'L',
    deps: ['P5-02', 'P4-02'],
    goal: 'Collision-free spot reservation backed by PostgreSQL GiST exclusion constraints, server-side tariff calculation, and encrypted QR pass.',
    files: ['backend/src/main/resources/db/migration/V7__booking.sql', 'parking/application/Booking*', 'parking/api/*'],
    steps: [
      'Author V7__booking.sql migration applying btree_gist exclusion constraint on (spot_id, booking_interval).',
      'Implement PricingService computing exact tariff based on vehicle type and duration.',
      'Wire reservation creation with atomic wallet debit in single transaction.',
      'Generate encrypted pass payload with QR verification token.',
      'Execute multi-threaded concurrency tests to verify collision prevention.'
    ],
    accept: [
      'Double-booking mathematically impossible under concurrent execution.',
      'Payment failure rolls back reservation atomically.'
    ],
    tests: ['PricingServiceTest', 'ConcurrencyBookingStressTest', 'BookingControllerTest'],
    blockedBy: []
  },
  {
    id: 'P5-04',
    title: 'Flex-Share Peer Parking Exchange & Rewards Engine',
    status: 'Backlog',
    pr: 'feature/P5-04-flex-share',
    branch: 'feature/P5-04-flex-share',
    pri: 'High',
    cx: 'L',
    deps: ['P5-03'],
    goal: 'Intelligent spot-sharing marketplace allowing permit holders to temporarily release unused spots to peers during classes and earn wallet rewards.',
    files: ['parking/domain/Flex*', 'parking/application/Flex*', 'parking/api/*'],
    steps: [
      'Create FlexShareOffer and FlexShareClaim domain entities.',
      'Implement slot matching service verifying return-time windows.',
      'Implement idempotent reward credit service updating owner wallet upon release.',
      'Create FlexShareController and abuse prevention guards.'
    ],
    accept: [
      'Reward credited exactly once per verified exchange.',
      'Spot guaranteed available for primary permit holder upon scheduled return.'
    ],
    tests: ['FlexShareServiceTest', 'ConcurrentClaimTest', 'FlexShareControllerTest'],
    blockedBy: []
  },
  {
    id: 'P5-05',
    title: 'ALPR Gate Access Decision Engine (Hardware Adapter Port)',
    status: 'Backlog',
    pr: 'feature/P5-05-gate-api',
    branch: 'feature/P5-05-gate-api',
    pri: 'Medium',
    cx: 'M',
    deps: ['P5-03'],
    goal: 'Low-latency webhook API processing vehicle license plates, verifying active permits, and actuating gate barriers via a pluggable adapter.',
    files: ['parking/application/Gate*', 'parking/infra/SimulatedAlprAdapter.java', 'parking/api/*'],
    steps: [
      'Define GateHardwarePort interface and implement SimulatedAlprAdapter.',
      'Implement GateDecisionService resolving license plates against active bookings.',
      'Log 100% of gate entry/exit events in gate_event audit table.',
      'Expose /api/v1/gate/scan webhook endpoint with sub-200ms target latency.'
    ],
    accept: [
      'Unambiguous access decision (ALLOW/DENY) with explicit reason code for every scan.',
      'Audit log tracks timestamp, plate, confidence score, and decision.'
    ],
    tests: ['GateDecisionServiceTest', 'GateControllerTest', 'PerformanceLatencyTest'],
    blockedBy: []
  },
  {
    id: 'P5-06',
    title: 'Interactive 30-Spot Parking Grid UI',
    status: 'Backlog',
    pr: 'feature/P5-06-map-ui',
    branch: 'feature/P5-06-map-ui',
    pri: 'High',
    cx: 'M',
    deps: ['P3-05', 'P5-02'],
    goal: 'Visual parking map rendering all 30 campus spots with live status badges, zone filters, and spot detail dialogs.',
    files: ['frontend/src/features/parking/map/*'],
    steps: [
      'Build SpotCard and ParkingGrid components with color-coded status badges.',
      'Implement zone filter tabs (All, North Zone, South Zone, Disabled).',
      'Build SpotDetailModal displaying spot telemetry and reservation button.',
      'Verify responsiveness and touch targets on mobile viewports.'
    ],
    accept: [
      'Visual parity with master design showcase in both dark and light modes.',
      'Grid renders smoothly with zero layout jumps upon status changes.'
    ],
    tests: ['ParkingGrid component tests', 'SpotCard test', 'Playwright map interaction'],
    blockedBy: []
  },
  {
    id: 'P5-07',
    title: 'Parking Booking & Encrypted Pass Modal UI',
    status: 'Backlog',
    pr: 'feature/P5-07-booking-ui',
    branch: 'feature/P5-07-booking-ui',
    pri: 'High',
    cx: 'M',
    deps: ['P5-03', 'P5-06'],
    goal: 'Reservation modal with duration sliders, vehicle picker, live tariff calculation, and scannable QR gate pass display.',
    files: ['frontend/src/features/parking/booking/*'],
    steps: [
      'Build BookingModal with duration slider, vehicle selection, and live cost calculation.',
      'Wire reservation submission to Booking API with optimistic UI updates.',
      'Build DigitalPassModal rendering encrypted QR code and booking reference.',
      'Handle error cases (insufficient funds, slot conflict).'
    ],
    accept: [
      'Calculated price matches server-side tariff calculation exactly.',
      'QR pass renders crisply and scans cleanly with standard barcode scanners.'
    ],
    tests: ['BookingModal validation test', 'PassModal QR test', 'Playwright booking flow'],
    blockedBy: []
  },
  {
    id: 'P5-08',
    title: 'Flex-Share Marketplace UI',
    status: 'Backlog',
    pr: 'feature/P5-08-flex-ui',
    branch: 'feature/P5-08-flex-ui',
    pri: 'Medium',
    cx: 'M',
    deps: ['P5-04', 'P5-06'],
    goal: 'One-click spot sharing activation toggle, projected reward estimator, and active exchange status tracker.',
    files: ['frontend/src/features/parking/flex/*'],
    steps: [
      'Build FlexShareToggle and reward estimation widget.',
      'Build active exchange status banner and claim confirmation dialog.',
      'Wire components to Flex-Share API endpoints.',
      'Handle expiration and cancellation states.'
    ],
    accept: [
      'Exact visual match with master design showcase.',
      'Prevents duplicate offer activation on already shared spots.'
    ],
    tests: ['FlexShare component tests', 'Playwright exchange flow'],
    blockedBy: []
  },
  {
    id: 'P5-09',
    title: 'ALPR Camera Scanner & IoT Sensor Simulator UI',
    status: 'Backlog',
    pr: 'feature/P5-09-gate-sim-ui',
    branch: 'feature/P5-09-gate-sim-ui',
    pri: 'Low',
    cx: 'M',
    deps: ['P5-05'],
    goal: 'Interactive presentation simulator demonstrating gate camera OCR recognition, distance slider sensor injection, and hardware diagnostics.',
    files: ['frontend/src/features/parking/gate/*', 'simulator/*'],
    steps: [
      'Build GateScannerPreview demonstrating OCR plate framing and barrier animation.',
      'Build SimulatorPanel with ultrasonic sensor distance sliders and event triggers.',
      'Integrate subtle audio feedback synthesizer for successful badge scans.',
      'Wire simulator events to backend gate decision endpoint.'
    ],
    accept: [
      'Demonstrates full entry/exit pipeline with realistic visual telemetry.',
      'Audio synthesizer plays feedback without blocking the UI thread.'
    ],
    tests: ['GateScanner component tests', 'Simulator interaction tests'],
    blockedBy: []
  },
  {
    id: 'P6-01',
    title: 'Peer Tutoring Course Catalog & Offerings API',
    status: 'Backlog',
    pr: 'feature/P6-01-tutoring-api',
    branch: 'feature/P6-01-tutoring-api',
    pri: 'High',
    cx: 'L',
    deps: ['P2-03'],
    goal: 'Certified course catalog, tutor qualification verification, and session offering publishing API.',
    files: ['backend/src/main/resources/db/migration/V8__tutoring.sql', 'tutoring/**'],
    steps: [
      'Author V8__tutoring.sql migration creating course and tutoring_session tables.',
      'Implement Course and TutoringSession JPA domain entities.',
      'Implement TutoringService with category, course, and date filters.',
      'Create TutoringController exposing /api/v1/tutoring/ endpoints.'
    ],
    accept: [
      'Only qualified honors students permitted to publish tutoring sessions.',
      'Search query supports course code, title, and tutor name.'
    ],
    tests: ['TutoringServiceTest', 'TutoringRepositoryTest', 'TutoringControllerTest'],
    blockedBy: []
  },
  {
    id: 'P6-02',
    title: 'Tutoring Booking & Automated 70 SAR/Hour Escrow Transfer',
    status: 'Backlog',
    pr: 'feature/P6-02-tutoring-booking',
    branch: 'feature/P6-02-tutoring-booking',
    pri: 'Critical',
    cx: 'L',
    deps: ['P6-01', 'P4-02'],
    goal: 'Session enrollment engine executing atomic fee transfers (70 SAR/hr standard rate) from student wallet to tutor tuition credit account.',
    files: ['tutoring/application/*', 'tutoring/api/*'],
    steps: [
      'Implement enrollment service enforcing student capacity limits.',
      'Execute atomic wallet transfer deducting 70 SAR/hr and crediting tutor ledger.',
      'Prevent duplicate enrollment and tutor self-booking.',
      'Expose booking endpoint with confirmation notifications.'
    ],
    accept: [
      'Insufficient wallet balance blocks booking with clear error message.',
      'Standardized 70 SAR/hr rate enforced strictly on backend.'
    ],
    tests: ['TutoringBookingServiceTest', 'ConcurrentEnrollmentTest', 'BookingControllerTest'],
    blockedBy: []
  },
  {
    id: 'P6-03',
    title: 'Peer Tutoring Marketplace UI',
    status: 'Backlog',
    pr: 'feature/P6-03-tutoring-ui',
    branch: 'feature/P6-03-tutoring-ui',
    pri: 'High',
    cx: 'M',
    deps: ['P6-02', 'P3-05'],
    goal: 'Student tutoring portal with course filtering, tutor rating cards, booking dialog, and tutor session creation modal.',
    files: ['frontend/src/features/tutoring/*'],
    steps: [
      'Build TutoringHub with subject filters and course search bar.',
      'Build TutorCard displaying verified badge, hourly rate (70 SAR), and availability.',
      'Build BookingModal showing session details and wallet balance confirmation.',
      'Build CreateSessionModal for approved student tutors.'
    ],
    accept: [
      'Visual parity with master design showcase in dark and light modes.',
      'Instant wallet balance debit confirmation feedback.'
    ],
    tests: ['TutoringHub component tests', 'BookingModal validation test', 'Playwright tutoring flow'],
    blockedBy: []
  },
  {
    id: 'P6-04',
    title: 'Faculty Office Hours & Dean\'s Hub API',
    status: 'Backlog',
    pr: 'feature/P6-04-office-hours-api',
    branch: 'feature/P6-04-office-hours-api',
    pri: 'High',
    cx: 'L',
    deps: ['P2-03'],
    goal: 'College leadership and faculty availability windows management with collision-free student appointment booking.',
    files: ['backend/src/main/resources/db/migration/V9__office_hours.sql', 'officehours/**'],
    steps: [
      'Author V9__office_hours.sql migration with btree_gist exclusion on faculty appointment intervals.',
      'Implement FacultyWindow and Appointment domain entities.',
      'Implement OfficeHoursService managing recurring windows and appointment bookings.',
      'Create OfficeHoursController with topic classification (Senior Project, Logic Design, Advising).'
    ],
    accept: [
      'Overlapping appointments physically impossible under database exclusion constraints.',
      'Faculty members can configure and manage only their own office hours.'
    ],
    tests: ['OfficeHoursServiceTest', 'AppointmentExclusionConstraintTest', 'OfficeHoursControllerTest'],
    blockedBy: []
  },
  {
    id: 'P6-05',
    title: 'Faculty Office Hours & Dean\'s Appointment UI',
    status: 'Backlog',
    pr: 'feature/P6-05-office-hours-ui',
    branch: 'feature/P6-05-office-hours-ui',
    pri: 'Medium',
    cx: 'M',
    deps: ['P6-04', 'P3-05'],
    goal: 'Faculty directory cards (Dean of Computing, Department Chairs), available time slot picker, and appointment booking confirmation.',
    files: ['frontend/src/features/office-hours/*'],
    steps: [
      'Build FacultyDirectory listing academic leaders and professors.',
      'Build SlotPicker displaying real-time available appointment slots.',
      'Build AppointmentModal supporting topic selection and notes.',
      'Wire appointment confirmation with calendar export.'
    ],
    accept: [
      'Visual match with Figma design system.',
      'Unavailable or booked slots disabled dynamically.'
    ],
    tests: ['FacultyDirectory component tests', 'AppointmentModal test', 'Playwright booking flow'],
    blockedBy: []
  },
  {
    id: 'P6-06',
    title: 'Study Rooms & Computer Labs Reservation API',
    status: 'Backlog',
    pr: 'feature/P6-06-rooms-api',
    branch: 'feature/P6-06-rooms-api',
    pri: 'High',
    cx: 'L',
    deps: ['P2-03'],
    goal: 'Collaborative study pods and laboratory booking engine with active session extension, release, and GiST overlap prevention.',
    files: ['backend/src/main/resources/db/migration/V10__rooms.sql', 'rooms/**'],
    steps: [
      'Author V10__rooms.sql migration with btree_gist exclusion on room booking intervals.',
      'Implement Room and RoomBooking domain entities.',
      'Implement RoomService supporting create, extend, and release operations.',
      'Enforce maximum consecutive booking duration limits.'
    ],
    accept: [
      'Collision-free scheduling guaranteed across all study pods and labs.',
      'Early release immediately frees slot for other waiting workgroups.'
    ],
    tests: ['RoomServiceTest', 'RoomBookingExclusionTest', 'RoomControllerTest'],
    blockedBy: []
  },
  {
    id: 'P6-07',
    title: 'Study Rooms UI & Digital Evacuation Timer',
    status: 'Backlog',
    pr: 'feature/P6-07-rooms-ui',
    branch: 'feature/P6-07-rooms-ui',
    pri: 'Medium',
    cx: 'M',
    deps: ['P6-06', 'P3-05'],
    goal: 'Room catalog cards, live occupancy indicators, pod booking dialog, and prominent real-time countdown evacuation timer.',
    files: ['frontend/src/features/rooms/*'],
    steps: [
      'Build RoomCatalog displaying pod capacity, equipment tags, and availability status.',
      'Build RoomBookingModal supporting team member entry and duration selection.',
      'Build EvacuationTimer displaying live countdown with color-coded warning thresholds.',
      'Implement extension request and early release actions.'
    ],
    accept: [
      'Matches master design showcase.',
      'Countdown timer decrements accurately without memory leaks or drift.'
    ],
    tests: ['RoomCatalog component tests', 'EvacuationTimer test', 'Playwright room reservation flow'],
    blockedBy: []
  },
  {
    id: 'P7-01',
    title: 'In-App Notification Engine & Notification API',
    status: 'Backlog',
    pr: 'feature/P7-01-notifications-api',
    branch: 'feature/P7-01-notifications-api',
    pri: 'High',
    cx: 'M',
    deps: ['P2-03'],
    goal: 'Real-time notification service managing unread alerts, batch marking as read, and persistent event notifications.',
    files: ['backend/src/main/resources/db/migration/V11__notifications.sql', 'notification/**'],
    steps: [
      'Author V11__notifications.sql migration creating in_app_notification table.',
      'Implement Notification domain entity, repository, and service.',
      'Implement NotificationController with mark-as-read and unread count endpoints.',
      'Enforce security checks ensuring users access only their own notifications.'
    ],
    accept: [
      'Notification queries return only recipient records with zero data leakage.',
      'Unread count query optimized for frequent polling.'
    ],
    tests: ['NotificationServiceTest', 'NotificationControllerTest', 'SecurityIsolationTest'],
    blockedBy: []
  },
  {
    id: 'P7-02',
    title: 'Event-Driven Notification Bus Dispatcher',
    status: 'Backlog',
    pr: 'feature/P7-02-notification-events',
    branch: 'feature/P7-02-notification-events',
    pri: 'High',
    cx: 'M',
    deps: ['P7-01', 'P4-02', 'P5-03', 'P6-02', 'P6-04'],
    goal: 'Decoupled Spring application event listeners automatically triggering notifications for parking reservations, payments, and tutoring sessions.',
    files: ['Domain modules: event publishers', 'notification/application/listeners/*'],
    steps: [
      'Define domain events (BookingCreatedEvent, PaymentProcessedEvent, SessionBookedEvent).',
      'Implement asynchronous @TransactionalEventListener handlers in notification module.',
      'Format bilingual notification templates with action links.',
      'Write integration tests verifying end-to-end event propagation.'
    ],
    accept: [
      'Every major business transaction produces an in-app notification reliably.',
      'Event failures do not break the underlying business transaction.'
    ],
    tests: ['NotificationEventListenerIntegrationTest'],
    blockedBy: []
  },
  {
    id: 'P7-03',
    title: 'Notification Center UI (Header Bell & Slide-out Drawer)',
    status: 'Backlog',
    pr: 'feature/P7-03-notifications-ui',
    branch: 'feature/P7-03-notifications-ui',
    pri: 'Medium',
    cx: 'S',
    deps: ['P7-01'],
    goal: 'Top bar notification bell with animated unread badge counter and slide-out notification drawer with instant read actions.',
    files: ['frontend/src/features/notifications/*'],
    steps: [
      'Build NotificationBell component with animated unread counter.',
      'Build NotificationDrawer displaying categorized notification cards.',
      'Implement TanStack Query polling and optimistic mark-as-read mutations.',
      'Add notification sound feedback.'
    ],
    accept: [
      'Unread badge count synchronizes accurately with server state.',
      'Drawer slides smoothly with full keyboard accessibility.'
    ],
    tests: ['NotificationBell component tests', 'NotificationDrawer interaction test'],
    blockedBy: []
  },
  {
    id: 'P7-04',
    title: 'System Administration & Governance API',
    status: 'Backlog',
    pr: 'feature/P7-04-admin-api',
    branch: 'feature/P7-04-admin-api',
    pri: 'Medium',
    cx: 'L',
    deps: ['P5-01', 'P6-06'],
    goal: 'Privileged administrative endpoints for managing campus parking spots, study rooms, tariff rules, and user role assignments.',
    files: ['Admin endpoints across domain modules'],
    steps: [
      'Implement admin controllers with @PreAuthorize("hasRole(\'CAMPUS_ADMIN\')").',
      'Provide administrative CRUD endpoints for spots, rooms, and tariffs.',
      'Record all administrative overrides in audit log ledger.',
      'Write security tests verifying access restriction.'
    ],
    accept: [
      'Non-admin requests receive 403 Forbidden with RFC 7807 problem details.',
      'Every administrative modification produces an audit trail.'
    ],
    tests: ['AdminControllerTest', 'SecurityMatrixTest', 'AuditLoggingTest'],
    blockedBy: []
  },
  {
    id: 'P7-05',
    title: 'Administrative Control Dashboard UI',
    status: 'Backlog',
    pr: 'feature/P7-05-admin-ui',
    branch: 'feature/P7-05-admin-ui',
    pri: 'Medium',
    cx: 'L',
    deps: ['P7-04'],
    goal: 'Administrative back-office management tables for campus resource configuration, user roles, and spot status overrides.',
    files: ['frontend/src/features/admin/*'],
    steps: [
      'Build AdminLayout with admin navigation guard.',
      'Build SpotManagementTable with status override actions.',
      'Build UserManagementTable with role assignment controls.',
      'Wire forms and modal dialogs to Admin API.'
    ],
    accept: [
      'Completely inaccessible to non-admin roles.',
      'Modifications update data tables immediately with toast confirmations.'
    ],
    tests: ['AdminLayout guard tests', 'SpotManagementTable test', 'Playwright admin flow'],
    blockedBy: []
  },
  {
    id: 'P7-06',
    title: 'Campus Analytics & Reporting Telemetry Engine',
    status: 'Backlog',
    pr: 'feature/P7-06-analytics',
    branch: 'feature/P7-06-analytics',
    pri: 'Low',
    cx: 'M',
    deps: ['P5-03'],
    goal: 'Real-time analytics queries calculating hourly spot utilization, peak arrival curves, tutoring volume, and carbon emission offsets.',
    files: ['analytics/**', 'frontend/src/features/analytics/*'],
    steps: [
      'Author optimized SQL analytical aggregation queries.',
      'Create AnalyticsController exposing metrics endpoints.',
      'Build interactive chart visualizations in frontend (peak hours, occupancy curves).',
      'Verify performance under large historical datasets.'
    ],
    accept: [
      'All analytics metrics derived from actual database records with zero synthetic mock data.',
      'Aggregation queries execute in under 100ms.'
    ],
    tests: ['AnalyticsRepositoryTest', 'AnalyticsControllerTest', 'ChartComponentTest'],
    blockedBy: []
  },
  {
    id: 'P8-01',
    title: 'Comprehensive Security Audit (OWASP ASVS, Dependency Scan & Headers)',
    status: 'Backlog',
    pr: 'test/P8-01-security-review',
    branch: 'test/P8-01-security-review',
    pri: 'High',
    cx: 'L',
    deps: ['P7-06'],
    goal: 'Security vulnerability assessment following OWASP ASVS guidelines, OWASP dependency vulnerability scanning, and HTTP security header hardening.',
    files: ['security configuration', 'docs/security-review.md'],
    steps: [
      'Execute OWASP ASVS Level 2 verification audit.',
      'Run automated dependency vulnerability scans across Maven and npm.',
      'Harden Content-Security-Policy, HSTS, X-Content-Type-Options, and CORS headers.',
      'Author penetration test suite covering injection and broken authorization.'
    ],
    accept: [
      'Zero High or Critical vulnerabilities in application dependencies.',
      'Security headers present and verified on all HTTP responses.'
    ],
    tests: ['DependencyCheck scan', 'SecurityHeaderTest', 'PenetrationTestSuite'],
    blockedBy: []
  },
  {
    id: 'P8-02',
    title: 'Comprehensive End-to-End Test Suite (Playwright)',
    status: 'Backlog',
    pr: 'test/P8-02-e2e-suite',
    branch: 'test/P8-02-e2e-suite',
    pri: 'High',
    cx: 'L',
    deps: ['P7-06'],
    goal: 'Automated browser test suite verifying core user journeys across Arabic and English locales and dual light/dark themes.',
    files: ['frontend/e2e/**'],
    steps: [
      'Configure Playwright test harness with authentication fixtures.',
      'Write E2E test specs for parking booking, tutoring enrollment, and tuition payment.',
      'Test bilingual switching (AR/EN) and dark/light theme persistence.',
      'Integrate Playwright suite into GitHub Actions CI pipeline.'
    ],
    accept: [
      '100% pass rate across all critical user journeys on Chromium, Firefox, and WebKit.',
      'Automated video and trace capture on failure.'
    ],
    tests: ['Playwright E2E full test suite'],
    blockedBy: []
  },
  {
    id: 'P8-03',
    title: 'Responsive Design & Accessibility (WCAG 2.1 AA) Audit',
    status: 'Backlog',
    pr: 'fix/P8-03-responsive-a11y',
    branch: 'fix/P8-03-responsive-a11y',
    pri: 'Medium',
    cx: 'M',
    deps: ['P7-06'],
    goal: 'Multi-device viewport validation (mobile 360px, tablet 768px, desktop 1280px+) and automated axe accessibility auditing.',
    files: ['frontend/**'],
    steps: [
      'Run automated axe accessibility scans across all application routes.',
      'Audit color contrast ratios and keyboard focus navigation rings.',
      'Verify viewport responsiveness at 360px, 768px, 1024px, and 1440px.',
      'Fix any identified contrast or keyboard accessibility defects.'
    ],
    accept: [
      'Zero critical accessibility violations under WCAG 2.1 Level AA standards.',
      'Zero horizontal overflow or layout breakage across all viewports.'
    ],
    tests: ['Axe accessibility audit', 'Playwright multi-viewport visual test'],
    blockedBy: []
  },
  {
    id: 'P8-04',
    title: 'High-Concurrency Load & Stress Testing (JMeter / k6)',
    status: 'Backlog',
    pr: 'test/P8-04-performance',
    branch: 'test/P8-04-performance',
    pri: 'Medium',
    cx: 'M',
    deps: ['P7-06'],
    goal: 'Concurrency stress testing of financial ledger transfers and parking spot reservations under simulated peak campus traffic.',
    files: ['backend/src/test/**', 'load scripts'],
    steps: [
      'Author load testing scenarios simulating 500 concurrent booking attempts.',
      'Execute load tests against containerized PostgreSQL and backend environment.',
      'Analyze database lock contention and optimize connection pool parameters.',
      'Document latency percentiles (p95, p99) under peak load.'
    ],
    accept: [
      'Zero balance drift or negative balances under maximum concurrency.',
      'Zero double-bookings permitted by database exclusion constraints.'
    ],
    tests: ['JMeter/k6 load test execution', 'Database integrity post-load audit'],
    blockedBy: []
  },
  {
    id: 'P8-05',
    title: 'Saudi PDPL Data Privacy & Audit Log Compliance Review',
    status: 'Backlog',
    pr: 'chore/P8-05-privacy',
    branch: 'chore/P8-05-privacy',
    pri: 'Medium',
    cx: 'M',
    deps: ['P7-06'],
    goal: 'Verification of compliance with Saudi Personal Data Protection Law (PDPL), data minimization, and audit log scrubbing.',
    files: ['docs/privacy.md', 'logging configurations'],
    steps: [
      'Conduct complete audit of stored student personal identifiable information (PII).',
      'Verify that passwords, tokens, and national IDs are masked in all application logs.',
      'Document institutional data retention and deletion policies.',
      'Author comprehensive docs/privacy.md compliance report.'
    ],
    accept: [
      'PDPL compliance checklist completed and verified.',
      'Zero unmasked PII present in production application logs.'
    ],
    tests: ['Log scrubbing verification test', 'Compliance audit review'],
    blockedBy: []
  },
  {
    id: 'P9-01',
    title: 'Production Orchestration & Secrets Management',
    status: 'Backlog',
    pr: 'chore/P9-01-prod-config',
    branch: 'chore/P9-01-prod-config',
    pri: 'High',
    cx: 'M',
    deps: ['P8-05'],
    goal: 'Hardened production Docker Compose configuration, TLS termination, reverse proxy rules, and externalized secrets injection.',
    files: ['docker-compose.prod.yml', 'docs/runbooks/deployment.md'],
    steps: [
      'Author hardened docker-compose.prod.yml with non-root security contexts.',
      'Configure Nginx reverse proxy with TLS certificate termination and HTTP/2.',
      'Externalize all production secrets via environment variables.',
      'Document complete production deployment runbook.'
    ],
    accept: [
      'Zero secrets or sensitive defaults stored in git repository.',
      'Production stack starts cleanly with all services healthy.'
    ],
    tests: ['Production compose startup drill', 'TLS certificate configuration test'],
    blockedBy: []
  },
  {
    id: 'P9-02',
    title: 'Continuous Deployment (CD) Pipeline & Staging Delivery',
    status: 'Backlog',
    pr: 'ci/P9-02-cd',
    branch: 'ci/P9-02-cd',
    pri: 'High',
    cx: 'M',
    deps: ['P9-01'],
    goal: 'Automated GitHub Actions deployment pipeline building verified production images and deploying to staging environment.',
    files: ['.github/workflows/cd.yml'],
    steps: [
      'Configure GitHub Actions CD workflow triggered on main branch tags.',
      'Build and tag multi-arch production Docker images.',
      'Deploy to staging target environment via SSH/Webhook.',
      'Execute automated smoke verification tests post-deployment.'
    ],
    accept: [
      'Automated deployment completes without manual intervention.',
      'Failing smoke test triggers automatic deployment rollback.'
    ],
    tests: ['CD pipeline execution drill', 'Post-deploy smoke test'],
    blockedBy: []
  },
  {
    id: 'P9-03',
    title: 'Automated Database Backup, Disaster Recovery & Health Monitoring',
    status: 'Backlog',
    pr: 'chore/P9-03-backup-monitoring',
    branch: 'chore/P9-03-backup-monitoring',
    pri: 'High',
    cx: 'M',
    deps: ['P9-01'],
    goal: 'Automated PostgreSQL backup cron jobs, verified point-in-time recovery runbook, and Prometheus/Grafana metric telemetry.',
    files: ['scripts/backup*', 'docs/runbooks/backup-restore.md'],
    steps: [
      'Author automated pg_dump backup script with encryption and compression.',
      'Implement backup rotation policy with automated pruning.',
      'Perform and document complete disaster recovery restoration drill.',
      'Configure Prometheus actuator metric scraping and alert rules.'
    ],
    accept: [
      'Database restoration drill proves clean recovery with zero data loss.',
      'Automated alerts trigger on container downtime or high resource utilization.'
    ],
    tests: ['Disaster recovery restoration drill', 'Alert notification test'],
    blockedBy: []
  },
  {
    id: 'P9-04',
    title: 'Operational Runbooks Completion & Milestone v1.0 Release',
    status: 'Backlog',
    pr: 'chore/P9-04-release-1.0',
    branch: 'chore/P9-04-release-1.0',
    pri: 'High',
    cx: 'M',
    deps: ['P9-02', 'P9-03'],
    goal: 'Finalization of operational procedures, maintenance runbooks, CHANGELOG publication, and official v1.0 semantic release tagging.',
    files: ['docs/runbooks/*', 'CHANGELOG.md'],
    steps: [
      'Finalize incident response, maintenance, and upgrade runbooks.',
      'Compile comprehensive CHANGELOG.md documenting all delivered capabilities.',
      'Create official git release tag v1.0.0.',
      'Conduct final production verification and formal handover.'
    ],
    accept: [
      'All operational runbooks validated by peer engineering review.',
      'Milestone v1.0 published and deployed successfully.'
    ],
    tests: ['Full system regression suite', 'Production smoke test pass'],
    blockedBy: []
  }
];

// Metrics
const totalDone = tasks.filter((t) => t.status === 'Done').length;
const totalInProgress = tasks.filter((t) => t.status === 'In Progress').length;
const totalBacklog = tasks.filter((t) => t.status === 'Backlog').length;
const percent = Math.round((totalDone / tasks.length) * 100);
const activeTask = tasks.find((t) => t.status === 'In Progress');

const statusBadge = (s) => {
  if (s === 'Done') return `<span class="badge badge-done">Done ✅</span>`;
  if (s === 'In Progress') return `<span class="badge badge-prog">In Progress ⏳</span>`;
  if (s === 'In Review') return `<span class="badge badge-rev">In Review 🔍</span>`;
  return `<span class="badge badge-back">Backlog 📋</span>`;
};

const priBadge = (p) => {
  if (p === 'Critical') return `<span class="badge badge-crit">Critical</span>`;
  if (p === 'High') return `<span class="badge badge-high">High</span>`;
  if (p === 'Medium') return `<span class="badge badge-med">Medium</span>`;
  return `<span class="badge badge-low">Low</span>`;
};

// Styling
const css = `
@page {
  size: A4;
  margin: 12mm 14mm 14mm 14mm;
}
* { box-sizing: border-box; }
body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  direction: ltr;
  text-align: left;
  color: #0f172a;
  line-height: 1.6;
  font-size: 11.5px;
  background: #fff;
  margin: 0;
  padding: 0;
}
.page {
  page-break-after: always;
  min-height: 270mm;
  position: relative;
}

/* Header */
.hdr {
  background: linear-gradient(135deg, #093c35 0%, #116E63 100%);
  color: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.hdr .meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #d7a237;
  font-weight: 700;
  margin-bottom: 4px;
}
.hdr h1 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: #ffffff;
}
.hdr .sub {
  font-size: 11.5px;
  color: #e2e8f0;
  margin-top: 4px;
}

/* Section Cards */
.card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
}
.card-title {
  font-size: 12px;
  font-weight: 700;
  color: #116E63;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.goal-box {
  background: #fdfbf7;
  border-left: 4px solid #d7a237;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11.5px;
  color: #1e293b;
  margin: 8px 0;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
  font-size: 11px;
}
td, th {
  border: 1px solid #cbd5e1;
  padding: 5px 8px;
  text-align: left;
  vertical-align: middle;
}
th {
  background: #f1f5f9;
  font-weight: 600;
  color: #334155;
  width: 18%;
}
h2 {
  font-size: 12.5px;
  color: #116E63;
  margin: 12px 0 4px;
  border-bottom: 1.5px solid #d7a237;
  padding-bottom: 2px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
ul, ol {
  margin: 4px 0 8px 0;
  padding-left: 18px;
}
li {
  margin-bottom: 2px;
}
code {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10.5px;
  font-family: 'Consolas', 'Courier New', monospace;
  color: #0f172a;
}
.muted { color: #64748b; font-style: italic; }

/* Badges */
.badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-done { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.badge-prog { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
.badge-rev  { background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd; }
.badge-back { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

.badge-crit { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
.badge-high { background: #ffedd5; color: #c2410c; border: 1px solid #fdba74; }
.badge-med  { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
.badge-low  { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

/* Dashboard Cover */
.cover-header {
  text-align: center;
  padding: 20px 0 14px 0;
  border-bottom: 2px solid #116E63;
  margin-bottom: 14px;
}
.cover-header h1 {
  font-size: 22px;
  color: #093c35;
  margin: 0 0 4px 0;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.cover-header .institution {
  font-size: 13px;
  font-weight: 700;
  color: #116E63;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cover-header .desc {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 4px;
}

.stats-grid {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}
.stat-card {
  flex: 1;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
.stat-card .num {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.1;
}
.stat-card .lbl {
  font-size: 10.5px;
  color: #64748b;
  margin-top: 3px;
  font-weight: 600;
  text-transform: uppercase;
}

.progress-wrap {
  background: #e2e8f0;
  border-radius: 9999px;
  height: 16px;
  overflow: hidden;
  margin: 10px 0 14px 0;
}
.progress-bar {
  background: linear-gradient(90deg, #116E63 0%, #d7a237 100%);
  height: 100%;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  font-weight: 700;
}

.active-banner {
  background: #eff6ff;
  border: 1.5px solid #3b82f6;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 8px 0 14px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.foot {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 9.5px;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
}
`;

const renderTaskPage = (t) => {
  const phaseKey = t.id.split('-')[0];
  const phaseName = phases[phaseKey] ?? phaseKey;

  return `
<div class="page">
  <div class="hdr">
    <div class="meta-top">
      <span>Task Specification: ${t.id}</span>
      <span>Phase ${phaseKey} — ${esc(phaseName)}</span>
    </div>
    <h1>${esc(t.title)}</h1>
    <div class="sub">Git Branch: <code>${esc(t.branch)}</code> · Target Pull Request: ${esc(t.pr)}</div>
  </div>

  <div class="goal-box">
    <strong>Core Objective & Technical Scope:</strong><br>
    ${esc(t.goal)}
  </div>

  <table>
    <tr>
      <th>Priority Level</th>
      <td>${priBadge(t.pri)}</td>
      <th>Complexity Rating</th>
      <td><code>${t.cx}</code></td>
    </tr>
    <tr>
      <th>Execution Status</th>
      <td>${statusBadge(t.status)}</td>
      <th>Target PR / Commit</th>
      <td><code>${esc(t.pr)}</code></td>
    </tr>
    <tr>
      <th>Upstream Dependencies</th>
      <td colspan="3">${esc(dep(t))}</td>
    </tr>
    <tr>
      <th>Architecture Blockers</th>
      <td colspan="3">${t.blockedBy.length ? esc(t.blockedBy.join(', ')) : 'None (Ready for execution)'}</td>
    </tr>
  </table>

  <h2>Implementation Roadmap & Engineering Steps</h2>
  ${list(t.steps, true)}

  <h2>Target File Inventory & Expected Artifacts</h2>
  <ul>${t.files.map((f) => `<li><code>${esc(f)}</code></li>`).join('')}</ul>

  <h2>Acceptance Criteria & Quality Checklist</h2>
  ${list(t.accept, false)}

  <h2>Verification & Test Coverage Strategy</h2>
  ${list(t.tests, false)}

  <div class="foot">
    <span>FBSU Smart Campus & ALPR Smart Parking Platform — Engineering Master Backlog</span>
    <span>Automated Technical Specification · Page ${t.id}</span>
  </div>
</div>
`;
};

// Cover Dashboard Page
const doneTasks = (p) => tasks.filter((t) => t.id.startsWith(p));

const renderCoverPage = () => {
  return `
<div class="page">
  <div class="cover-header">
    <div class="institution">Fahad Bin Sultan University (FBSU) — Tabuk, KSA</div>
    <h1>Smart Campus & ALPR Smart Parking Platform</h1>
    <div class="desc">Engineering Master Backlog, Technical Specifications & Delivery Telemetry</div>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="num" style="color:#0f172a">${tasks.length}</div>
      <div class="lbl">Total Planned Tasks</div>
    </div>
    <div class="stat-card">
      <div class="num" style="color:#15803d">${totalDone}</div>
      <div class="lbl">Completed (Done) ✅</div>
    </div>
    <div class="stat-card">
      <div class="num" style="color:#1d4ed8">${totalInProgress}</div>
      <div class="lbl">In Progress ⏳</div>
    </div>
    <div class="stat-card">
      <div class="num" style="color:#64748b">${totalBacklog}</div>
      <div class="lbl">Backlog Remaining 📋</div>
    </div>
    <div class="stat-card">
      <div class="num" style="color:#116E63">${percent}%</div>
      <div class="lbl">Overall Delivery</div>
    </div>
  </div>

  <div class="progress-wrap">
    <div class="progress-bar" style="width: ${Math.max(percent, 5)}%">${percent}% COMPLETED</div>
  </div>

  ${activeTask ? `
  <div class="active-banner">
    <div>
      <span style="font-weight:700;color:#1e40af">ACTIVE SPRINT FOCUS:</span> 
      <strong style="color:#0f172a">${activeTask.id} — ${esc(activeTask.title)}</strong>
      <span style="margin-left:8px;font-size:10px;color:#475569">(\`${activeTask.branch}\`)</span>
    </div>
    <span class="badge badge-prog">In Progress ⏳</span>
  </div>` : ''}

  <h2>Phase-by-Phase Execution Progress</h2>
  <table style="margin-top:6px">
    <thead>
      <tr>
        <th style="width:10%">Phase</th>
        <th>Phase Domain Description</th>
        <th style="width:10%;text-align:center">Total</th>
        <th style="width:12%;text-align:center">Done ✅</th>
        <th style="width:12%;text-align:center">Active ⏳</th>
        <th style="width:12%;text-align:center">Backlog 📋</th>
        <th style="width:10%;text-align:center">% Done</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(phases).map(([k, name]) => {
        const pTasks = doneTasks(k);
        const pDone = pTasks.filter((t) => t.status === 'Done').length;
        const pProg = pTasks.filter((t) => t.status === 'In Progress').length;
        const pBack = pTasks.filter((t) => t.status === 'Backlog').length;
        const pPct = pTasks.length ? Math.round((pDone / pTasks.length) * 100) : 0;
        return `
        <tr>
          <td><strong>Phase ${k}</strong></td>
          <td>${esc(name)}</td>
          <td style="text-align:center"><strong>${pTasks.length}</strong></td>
          <td style="text-align:center;color:#15803d">${pDone}</td>
          <td style="text-align:center;color:#1d4ed8">${pProg}</td>
          <td style="text-align:center;color:#64748b">${pBack}</td>
          <td style="text-align:center;font-weight:700">${pPct}%</td>
        </tr>`;
      }).join('')}
      <tr style="background:#f8fafc;font-weight:700">
        <td colspan="2">TOTAL PROJECT BACKLOG</td>
        <td style="text-align:center">${tasks.length}</td>
        <td style="text-align:center;color:#15803d">${totalDone}</td>
        <td style="text-align:center;color:#1d4ed8">${totalInProgress}</td>
        <td style="text-align:center;color:#64748b">${totalBacklog}</td>
        <td style="text-align:center;color:#116E63">${percent}%</td>
      </tr>
    </tbody>
  </table>

  <h2>Master Task Inventory & Status Matrix</h2>
  <table style="margin-top:6px">
    <thead>
      <tr>
        <th style="width:10%">ID</th>
        <th>Task Title & Scope</th>
        <th style="width:10%;text-align:center">Priority</th>
        <th style="width:8%;text-align:center">Cx</th>
        <th style="width:14%;text-align:center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${tasks.slice(0, 16).map((t) => `
      <tr>
        <td><code>${t.id}</code></td>
        <td>${esc(t.title)}</td>
        <td style="text-align:center">${priBadge(t.pri)}</td>
        <td style="text-align:center"><code>${t.cx}</code></td>
        <td style="text-align:center">${statusBadge(t.status)}</td>
      </tr>`).join('')}
    </tbody>
  </table>

  <div class="foot">
    <span>FBSU Smart Campus & ALPR Smart Parking Platform — Enterprise Engineering Specifications</span>
    <span>Cover & Executive Progress Telemetry</span>
  </div>
</div>
`;
};

const buildDocument = (body) => `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>FBSU Smart Campus — Master Engineering Tasks Backlog</title>
  <style>${css}</style>
</head>
<body>
  ${body}
</body>
</html>`;

mkdirSync(htmlDir, { recursive: true });
mkdirSync(pdfDir, { recursive: true });

console.log('Generating English HTML and PDF artifacts...');

// 1. Build Master Consolidated PDF (ALL-TASKS)
const allHtml = buildDocument(renderCoverPage() + tasks.map(renderTaskPage).join(''));
const allHtmlPath = path.join(htmlDir, 'ALL-TASKS.html');
const allPdfPath = path.join(pdfDir, 'ALL-TASKS.pdf');
writeFileSync(allHtmlPath, allHtml, 'utf8');

console.log(`Rendering master PDF: ${allPdfPath} using headless browser...`);
execFileSync(edge, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${allPdfPath}`,
  pathToFileURL(allHtmlPath).href
], { stdio: 'ignore' });

console.log(`✅ Master English PDF successfully generated: ${allPdfPath}`);

// 2. Also generate individual English task PDFs
for (const t of tasks) {
  const taskHtml = buildDocument(renderTaskPage(t));
  const tHtmlPath = path.join(htmlDir, `${t.id}.html`);
  const tPdfPath = path.join(pdfDir, `${t.id}.pdf`);
  writeFileSync(tHtmlPath, taskHtml, 'utf8');
  execFileSync(edge, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${tPdfPath}`,
    pathToFileURL(tHtmlPath).href
  ], { stdio: 'ignore' });
}

console.log(`✅ All 53 individual task PDFs compiled in ${pdfDir}`);
