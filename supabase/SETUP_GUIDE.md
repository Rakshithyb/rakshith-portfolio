# Supabase Backend Setup & Security Guide

This guide describes how to configure your Supabase backend for **Rakshith Portfolio CMS** securely **without sharing database passwords or service-role keys in chat**.

---

## 1. Create Your Supabase Project
1. Log in to [database.new](https://database.new) (Supabase Console).
2. Click **New Project**.
3. Set:
   - **Name**: `rakshith-portfolio`
   - **Database Password**: Generate a secure password and store it safely in your password manager.
   - **Region**: Choose the closest region (e.g. `ap-south-1` Mumbai or `ap-southeast-1` Singapore).
4. Wait for the project initialization to complete.

---

## 2. Apply Database Migrations & RLS
1. In the Supabase Dashboard, go to **SQL Editor** in the left sidebar.
2. Open the file `supabase/migrations/20261009000000_init_schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. Next, open `supabase/migrations/20261009000001_storage_policies.sql`, paste its contents, and click **Run**.
5. All 6 tables (`admin_users`, `content_drafts`, `published_content`, `media_assets`, `site_settings`, `page_views`) and storage buckets are now created with strict Row Level Security (RLS) enabled.

---

## 3. Create & Authorize Your Administrator Account
Because public user registration is disabled for security:

1. In Supabase Dashboard, navigate to **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter:
   - **User Email**: Your personal email (e.g. `your-email@gmail.com`)
   - **Password**: Your chosen master admin password.
   - Check **Auto Confirm User?** -> **Yes**.
4. Click **Create User**.
5. Copy the newly created user's **User UID** (a UUID like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
6. Navigate back to the **SQL Editor** and run this query (replacing the UUID with your copied UID):

```sql
INSERT INTO public.admin_users (user_id)
VALUES ('PASTE_YOUR_USER_UID_HERE')
ON CONFLICT (user_id) DO NOTHING;
```

7. Your account is now allowlisted. No other user can modify drafts or publish content.

---

## 4. Configure Client Environment Variables
1. In the Supabase Dashboard, go to **Project Settings** > **API**.
2. Copy:
   - **Project URL**
   - **Project API Keys** > `anon` `public` key (This key is safe for browser use).
   - **NEVER copy or share the `service_role` key!**
3. In your local repository, create a `.env` file (which is git-ignored):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_ADMIN_EMAIL=your-email@gmail.com
   VITE_SITE_URL=https://rakshith-portfolio.vercel.app
   ```
4. Restart the Vite dev server (`npm run dev`) or re-build. The CMS will automatically detect the Supabase connection!
