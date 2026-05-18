# DRIP — Premium Streetwear & Footwear Marketplace

A full-stack clothing marketplace built with Next.js 14 (App Router), Supabase, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (product images)
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with lucide-react
- **Forms:** react-hook-form + zod validation
- **State:** Zustand (cart, auth)
- **Deployment:** Vercel

## Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

## Local Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd drip
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Run the SQL migration in your Supabase SQL editor:
   - Open `supabase/migrations/001_initial.sql`
   - Copy and paste the entire content into Supabase SQL editor
   - Click "Run"

5. Copy the environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

6. Fill in your Supabase credentials in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service_role key
   - `NEXT_PUBLIC_SITE_URL` — Set to `http://localhost:3000` for local dev

7. Create a Supabase Storage bucket called `product-images` with public read access.

8. Run the seed data (optional):
   - Execute `supabase/seed.sql` in the Supabase SQL editor to populate sample data.

9. To set an admin user, update the `role` column to `admin` in the `profiles` table for your user via the Supabase dashboard.

10. Start the development server:
    ```bash
    npm run dev
    ```

## Project Structure

```
drip/
├── app/                    # Next.js App Router pages
│   ├── (store)/           # Public store pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard pages
│   └── api/               # API routes
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── store/             # Store-specific components
│   └── admin/             # Admin-specific components
├── lib/                   # Utilities, hooks, stores
│   ├── supabase/          # Supabase clients
│   ├── store/             # Zustand stores
│   ├── hooks/             # Custom hooks
│   └── validations/       # Zod schemas
├── supabase/
│   └── migrations/        # Database migrations
└── config files           # next.config, tailwind, etc.
```

## Deploy to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add the environment variables from `.env.production.example` in Vercel's dashboard.
4. Deploy — Vercel will auto-detect Next.js and build accordingly.

## Post-Deployment Checklist

- [ ] Verify Supabase connection works
- [ ] Test authentication (sign up, sign in, sign out)
- [ ] Test product CRUD from admin panel
- [ ] Test image uploads
- [ ] Test cart functionality
- [ ] Test order creation
- [ ] Set up custom domain if needed
- [ ] Enable Supabase email confirmation (optional)
