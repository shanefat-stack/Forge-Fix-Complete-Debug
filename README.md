# Forge

A short wellness questionnaire that generates one clear action plan for your day. No wearable required.

## Setup

### 1. Clone and install

```bash
git clone https://github.com/shanefat-stack/Forge-Fix-Complete-Debug.git
cd Forge-Fix-Complete-Debug
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Deploy both Edge Functions:

```bash
npx supabase functions deploy generate-plan
npx supabase functions deploy follow-up
```

### 3. Set environment variables

Copy the example file and fill in your Supabase project credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase dashboard under **Settings → API**.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Netlify

Connect the repo to Netlify. The `netlify.toml` already configures the build command and the `@netlify/plugin-nextjs` plugin. Set the same environment variables in **Netlify → Site settings → Environment variables**.
