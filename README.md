# Reclama.AI

AI-powered legal claims intake and lawyer connection platform built with modern web technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v5 + shadcn/ui (indigo/slate theme)
- **Backend**: Supabase (Auth, Postgres, Storage, Edge Functions)
- **AI**: Vercel AI SDK with OpenAI
- **Payments**: Stripe Checkout + Webhooks
- **PDF Generation**: react-pdf + Supabase Edge Functions

## 📋 Features

### Core Functionality

- **Streaming Chat Intake**: Interactive AI-powered chat interface to gather claim information
- **Viability Score**: Real-time assessment of claim viability with warnings for scores <40%
- **Lawyer Directory**: City-based lawyer listings at `/abogados/[city]`
- **Payment Processing**: Stripe Checkout integration with webhook handling
- **Document Generation**: Automated PDF claim reports stored in Supabase Storage
- **Secure Database**: Row-Level Security (RLS) policies for data protection

### Database Schema

The platform uses four main tables:

1. **users**: User profiles and authentication
2. **claims**: Legal claim submissions with viability scores
3. **lawyers**: Verified lawyer profiles with ratings and specialties
4. **leads**: Connection between claims and lawyers

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mlarbi84/Reclama.ai.git
   cd Reclama.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. Run the database migration:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and execute the contents of `supabase/migrations/20260203_initial_schema.sql`
   
   c. Create a storage bucket:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `claims`
   - Set it to private
   
   d. Deploy the Edge Function:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Deploy the function
   supabase functions deploy generate-claim-pdf
   ```

5. **Set up Stripe webhooks**

   a. In your Stripe Dashboard, go to Developers → Webhooks
   
   b. Add an endpoint: `https://your-domain.com/api/stripe/webhook`
   
   c. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   
   d. Copy the webhook secret to your `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
Reclama.ai/
├── app/
│   ├── api/
│   │   ├── chat/              # AI chat endpoint
│   │   └── stripe/
│   │       └── webhook/       # Stripe webhook handler
│   ├── abogados/
│   │   └── [city]/            # Dynamic city-based lawyer listings
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page with chat
│   └── globals.css            # Global styles
├── components/
│   ├── chat/
│   │   └── chat-interface.tsx # Chat UI component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── supabase.ts            # Supabase client
│   ├── stripe.ts              # Stripe client
│   └── utils.ts               # Utility functions
├── supabase/
│   ├── functions/
│   │   └── generate-claim-pdf/# Edge function for PDF generation
│   └── migrations/            # Database migrations
└── package.json
```

## 📝 Usage

### For Users

1. Visit the home page
2. Start a conversation with the AI assistant
3. Describe your legal claim
4. Receive a viability score
5. Get matched with appropriate lawyers

### For Lawyers

1. Browse lawyers by city at `/abogados/[city]` (e.g., `/abogados/miami`)
2. View lawyer profiles, ratings, and specialties
3. Contact lawyers directly

## 🔒 Security

- **Row Level Security (RLS)**: Implemented on all database tables
- **Webhook Verification**: Stripe webhook signatures are verified
- **Environment Variables**: Sensitive keys stored in environment variables
- **Type Safety**: Full TypeScript implementation

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy!

### Important Post-Deployment Steps

1. Update Stripe webhook URL to your production domain
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Configure Supabase allowed origins
4. Test the complete flow end-to-end

## 📊 Database Migrations

To apply the database schema:

1. Log into your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20260203_initial_schema.sql`
4. Execute the SQL

The migration creates:
- All required tables (users, lawyers, claims, leads)
- Indexes for performance
- Row Level Security policies
- Triggers for automatic timestamp updates

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@reclama.ai or open an issue in the GitHub repository.