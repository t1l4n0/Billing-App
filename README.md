# Shopify Billing App with Badgify Integration

Eine umfassende Shopify App basierend auf Remix und TypeScript mit Standard-Admin-Oberfläche, Billing API Integration und integriertem Badgify Badge Generator.

## 🚀 Features

### 💳 Billing & Subscription
- 🔐 **Shopify OAuth Integration** - Sichere Authentifizierung mit Shopify
- 💳 **Billing API Integration** - Vollständige Subscription-Verwaltung
- 🆓 **3-Tage kostenlose Testphase** - Automatische Trial-Verwaltung
- 💰 **$9.99/Monat Abonnement** - Einfaches monatliches Billing
- 🔄 **Webhook Support** - Automatische Subscription-Verwaltung bei App-Deinstallation

### 🎯 Badgify Badge Generator
- ✨ **Custom Badge Generator** - Erstelle individuelle Badges
- 🎨 **Multiple Styles** - Flat, Flat-Square, Plastic, For-the-Badge, Social
- 🌈 **Farbauswahl** - Umfangreiche Farbpalette
- 🏷️ **Logo Integration** - Unterstützung für Simple Icons
- 📋 **Ready-to-use Presets** - Vorgefertigte Badge-Templates
- 📚 **Badge History** - Speichere und verwende Badges wieder
- 📝 **Export Funktionen** - Markdown und URL Export
- 💾 **Download Support** - SVG Badge Download

### 🎨 UI & UX
- 🎨 **Polaris UI** - Native Shopify Admin-Oberfläche
- 📱 **Responsive Design** - Funktioniert auf Desktop und Mobile
- 🔒 **Subscription Guard** - Feature-Zugriff basierend auf Subscription-Status

## Tech Stack

- **Framework**: Remix
- **Language**: TypeScript
- **Database**: SQLite mit Prisma ORM
- **UI**: Shopify Polaris
- **Authentication**: Shopify App Bridge
- **Billing**: Shopify Billing API
- **Badge Generation**: shields.io Integration

## Projektstruktur

```
shopify-billing-app/
├── app/
│   ├── components/
│   │   └── badgify/
│   │       ├── BadgeGenerator.tsx      # Hauptkomponente für Badge-Erstellung
│   │       ├── BadgePresets.tsx        # Vorgefertigte Badge-Templates
│   │       └── BadgeHistory.tsx        # Badge-Verlauf und Wiederverwendung
│   ├── routes/
│   │   ├── app.tsx                     # App Layout mit Navigation
│   │   ├── app._index.tsx              # Dashboard mit Badgify Integration
│   │   ├── app.billing.tsx             # Billing-Seite
│   │   ├── app.badgify.tsx             # Badgify Hauptseite
│   │   └── webhooks.*.tsx              # Webhook-Handler
│   ├── utils/
│   │   ├── billing.server.ts           # Billing-Logik
│   │   └── subscription-guard.server.ts # Subscription-Middleware
│   ├── shopify.server.ts               # Shopify-Konfiguration
│   └── root.tsx                        # App Root
├── prisma/
│   └── schema.prisma                   # Datenbankschema
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

## 🎯 Badgify Funktionen

### Badge Generator
- **Custom Text**: Beliebiger Text für Badges
- **Labels**: Optionale Labels für strukturierte Badges
- **Styles**: 5 verschiedene Badge-Stile
- **Colors**: Umfangreiche Farbauswahl
- **Logos**: Integration von Simple Icons
- **Live Preview**: Sofortige Vorschau der generierten Badges

### Badge Presets
Vorgefertigte Badges für häufige Anwendungsfälle:
- **Status Badges**: Build Status, Tests, etc.
- **Technology Badges**: React, TypeScript, Node.js, Shopify
- **Version Badges**: Versionsnummern und Releases
- **License Badges**: MIT, Apache 2.0, etc.
- **Social Badges**: GitHub Stars, Forks, etc.

### Badge History
- **Automatisches Speichern**: Generierte Badges werden automatisch gespeichert
- **Wiederverwendung**: Einfache Wiederverwendung gespeicherter Badges
- **Export**: URL und Markdown Export
- **Verwaltung**: Löschen und Organisieren der Badge-Historie

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

## API Endpoints

### Authentifizierung
- `GET /auth` - Shopify OAuth Start
- `GET /auth/callback` - OAuth Callback

### App Routes
- `GET /app` - Dashboard mit Badgify Integration
- `GET /app/billing` - Billing-Verwaltung
- `GET /app/badgify` - Badgify Badge Generator
- `POST /app/billing` - Subscription-Aktionen

### Webhooks
- `POST /webhooks/app/uninstalled` - App-Deinstallation
- `POST /webhooks/customers/data_request` - GDPR Datenabfrage
- `POST /webhooks/customers/redact` - GDPR Datenlöschung
- `POST /webhooks/shop/redact` - Shop-Datenlöschung

## 🎨 Badgify Usage Examples

### Einfacher Badge
```markdown
![Status](https://img.shields.io/badge/status-active-green)
```

### Badge mit Logo
```markdown
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
```

### Custom Badge
```markdown
![Custom](https://img.shields.io/badge/My%20Project-v1.0.0-blue?style=flat-square&logo=github)
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

**Badgify Components (`app/components/badgify/`)**
- `BadgeGenerator.tsx` - Hauptkomponente für Badge-Erstellung
- `BadgePresets.tsx` - Vorgefertigte Badge-Templates
- `BadgeHistory.tsx` - Badge-Verlauf und Wiederverwendung

**Billing Service (`app/utils/billing.server.ts`)**
- Zentrale Billing-Logik
- Subscription-Verwaltung
- Trial-Periode-Handling

**Subscription Guard (`app/utils/subscription-guard.server.ts`)**
- Middleware für Subscription-Überprüfung
- Route-Protection für Premium-Features
- Status-Checks

## 🔒 Subscription-basierte Features

Badgify ist als Premium-Feature implementiert:
- **Trial-Zugang**: Verfügbar während der 3-tägigen Testphase
- **Subscription Required**: Vollzugriff nur mit aktiver Subscription
- **Graceful Degradation**: Benutzerfreundliche Weiterleitung zur Billing-Seite

## Troubleshooting

### Häufige Probleme

1. **"JWT token expired" Fehler**
   - Stelle sicher, dass die Systemzeit korrekt ist
   - Aktiviere "Automatische Zeit- und Datumseinstellung"

2. **Billing API Fehler**
   - Überprüfe, ob der Billing-Plan im Partner Dashboard konfiguriert ist
   - Stelle sicher, dass `isTest: true` für Entwicklung gesetzt ist

3. **Badge Generation Fehler**
   - Überprüfe die Internetverbindung (shields.io Zugriff erforderlich)
   - Validiere Badge-Parameter (Text, Farben, etc.)

4. **Subscription Guard Fehler**
   - Überprüfe Subscription-Status in der Datenbank
   - Teste Trial-Periode-Logik

### Logs

```bash
# Entwicklung
npm run dev

# Produktion (Fly.io)
fly logs
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im Repository
- Kontaktiere den Entwickler
- Überprüfe die Dokumentation

---

**Powered by Shopify App Bridge, Remix, and shields.io** 🚀