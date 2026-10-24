# Rakshith YB — Developer Portfolio & CMS

A minimalist, high-performance developer portfolio with a secure content-management system (CMS) built for **Rakshith YB**, final-year B.E. Computer Science & Engineering student.

Designed with editorial typography, generous whitespace, subtle dividers, and an atomic **Draft → Private Preview → Explicit Publish** workflow.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, editorial monochrome design system
- **Motion & Icons**: Motion for React, Lucide React
- **Routing**: React Router v6
- **Backend**: Supabase PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security (RLS)
- **Data Access Layer**: Decoupled `ContentStore` supporting both live Supabase and zero-config local simulation mode

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Automated Security & Workflow Tests
```bash
npm run test:security
```

---

## 🔐 Publishing & Security Model

1. **Strict Draft Isolation**:
   - Saving changes in the CMS writes exclusively to `content_drafts`.
   - Public visitors only ever read from `published_content`.
   - Drafts are shielded by PostgreSQL Row Level Security (RLS) policies at the database engine level.
2. **Private Preview**:
   - Access `/preview` while authenticated to preview draft records in full fidelity before making them live.
3. **Atomic Publishing**:
   - Promoting a draft updates the public record atomically and stamps the publish timestamp.
   - Unpublishing removes the live record while retaining the draft for future editing.
4. **Zero Raw IP Tracking**:
   - The analytics telemetry records only the page path and referrer domain. No raw IP addresses, user cookies, or canvas fingerprints are stored.

---

## 🗄️ Supabase Backend Setup

Follow the complete step-by-step instructions in [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md) to initialize your PostgreSQL tables, Row Level Security policies, storage buckets, and authorized admin user.
