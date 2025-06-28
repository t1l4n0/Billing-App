# Shopify Billing App

Eine schlanke Shopify App basierend auf Remix und TypeScript mit Standard-Admin-Oberfläche und Implementierung der Billing API für ein vordefiniertes Abonnement.

## Features

- 🔐 **Shopify OAuth Integration** - Sichere Authentifizierung mit Shopify
- 💳 **Billing API Integration** - Vollständige Subscription-Verwaltung
- 🆓 **3-Tage kostenlose Testphase** - Automatische Trial-Verwaltung
- 💰 **$9.99/Monat Abonnement** - Einfaches monatliches Billing
- 🎨 **Polaris UI** - Native Shopify Admin-Oberfläche
- 📱 **Responsive Design** - Funktioniert auf Desktop und Mobile
- 🔄 **Webhook Support** - Automatische Subscription-Verwaltung bei App-Deinstallation

## Tech Stack

- **Framework**: Remix
- **Language**: TypeScript
- **Database**: SQLite mit Prisma ORM
- **UI**: Shopify Polaris
- **Authentication**: Shopify App Bridge
- **Billing**: Shopify Billing API

## Projektstruktur

```
shopify-billing-app/
├── app/
│   ├── routes/
│   │   ├── app.tsx                    # App Layout
│   │   ├── app._index.tsx             # Dashboard
│   │   ├── app.billing.tsx            # Billing-Seite
│   │   └── webhooks.app.uninstalled.tsx # Webhook-Handler
│   ├── utils/
│   │   ├── billing.server.ts          # Billing-Logik
│   │   └── subscription-guard.server.ts # Subscription-Middleware
│   ├── shopify.server.ts              # Shopify-Konfiguration
│   └── root.tsx                       # App Root
├── prisma/
│   └── schema.prisma                  # Datenbankschema
├── package.json
└── README.md
```

## Installation

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopiere `.env.example` zu `.env` und fülle die Werte aus:

```bash
cp .env.example .env
```

Bearbeite `.env`:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SCOPES=read_products,write_products
SHOPIFY_APP_URL=https://your-app-url.com

# Database
DATABASE_URL="file:./dev.db"

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### 3. Datenbank einrichten

```bash
# Prisma Client generieren
npm run db:generate

# Datenbank-Schema anwenden
npm run db:push
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

## Shopify Partner Dashboard Setup

### 1. App erstellen

1. Gehe zu [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Erstelle eine neue App
3. Wähle "Custom app" oder "Public app"

### 2. App-Konfiguration

**App Setup:**
- App name: Dein App-Name
- App URL: `https://your-app-url.com`
- Allowed redirection URL(s): `https://your-app-url.com/auth/callback`

**App Scopes:**
- `read_products` (oder nach Bedarf)
- `write_products` (optional)

**Webhooks:**
- App uninstalled: `https://your-app-url.com/webhooks/app/uninstalled`

### 3. Billing-Plan konfigurieren

Im Partner Dashboard unter "App pricing":

1. Erstelle einen neuen Pricing Plan
2. Name: "Basic Plan"
3. Preis: $9.99 USD
4. Billing-Intervall: Monatlich (30 Tage)
5. Trial-Periode: 3 Tage

## Deployment

### Fly.io (Empfohlen)

1. **Fly.io CLI installieren:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **App initialisieren:**
   ```bash
   fly launch
   ```

3. **Umgebungsvariablen setzen:**
   ```bash
   fly secrets set SHOPIFY_API_KEY=your_api_key
   fly secrets set SHOPIFY_API_SECRET=your_api_secret
   fly secrets set SHOPIFY_APP_URL=https://your-app.fly.dev
   fly secrets set SESSION_SECRET=your_session_secret
   ```

4. **Deployen:**
   ```bash
   fly deploy
   ```

### Andere Hosting-Anbieter

Die App kann auf jedem Node.js-kompatiblen Hosting-Service deployed werden:
- Vercel
- Railway
- Heroku
- DigitalOcean App Platform

## API Endpoints

### Authentifizierung
- `GET /auth` - Shopify OAuth Start
- `GET /auth/callback` - OAuth Callback

### App Routes
- `GET /app` - Dashboard
- `GET /app/billing` - Billing-Verwaltung
- `POST /app/billing` - Subscription-Aktionen

### Webhooks
- `POST /webhooks/app/uninstalled` - App-Deinstallation

## Datenbank Schema

### Session Table
Speichert Shopify-Session-Daten für Authentifizierung.

### Subscription Table
```sql
- id: String (Primary Key)
- shop: String (Unique)
- subscriptionId: String (Shopify Subscription ID)
- status: String (pending, active, cancelled, expired)
- planName: String
- price: Float
- currency: String
- billingCycle: String
- trialDays: Integer
- trialEndsAt: DateTime
- currentPeriodStart: DateTime
- currentPeriodEnd: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

## Entwicklung

### Verfügbare Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Produktions-Build erstellen
npm run start        # Produktionsserver starten
npm run typecheck    # TypeScript-Überprüfung
npm run lint         # Code-Linting
npm run lint:fix     # Automatische Lint-Fixes
npm run format       # Code-Formatierung
npm run db:generate  # Prisma Client generieren
npm run db:push      # Schema zu Datenbank pushen
npm run db:migrate   # Datenbank-Migration
```

### Code-Struktur

**Billing Service (`app/utils/billing.server.ts`)**
- Zentrale Billing-Logik
- Subscription-Verwaltung
- Trial-Periode-Handling

**Subscription Guard (`app/utils/subscription-guard.server.ts`)**
- Middleware für Subscription-Überprüfung
- Route-Protection
- Status-Checks

## Troubleshooting

### Häufige Probleme

1. **"JWT token expired" Fehler**
   - Stelle sicher, dass die Systemzeit korrekt ist
   - Aktiviere "Automatische Zeit- und Datumseinstellung"

2. **Billing API Fehler**
   - Überprüfe, ob der Billing-Plan im Partner Dashboard konfiguriert ist
   - Stelle sicher, dass `isTest: true` für Entwicklung gesetzt ist

3. **Webhook-Probleme**
   - Überprüfe die Webhook-URLs im Partner Dashboard
   - Stelle sicher, dass die App öffentlich erreichbar ist

### Logs

```bash
# Entwicklung
npm run dev

# Produktion (Fly.io)
fly logs
```

## Lizenz

MIT License

## Support

Bei Fragen oder Problemen erstelle ein Issue im Repository oder kontaktiere den Entwickler.

