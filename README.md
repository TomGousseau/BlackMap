# Blackrock V2 — Maps App

A premium dark-gold themed maps application with locations, businesses, and people. Built with Next.js 16, React 19, Leaflet, and MongoDB.

---

## Stack

- **Next.js 16** (Turbopack) — App Router, API routes
- **React 19** — UI
- **Tailwind CSS 4** — styling
- **Framer Motion** — animations
- **Leaflet + react-leaflet** — map (CartoDB dark tiles)
- **Lucide React** — icons
- **MongoDB** — database (Atlas)
- **jose** — JWT authentication
- **Lenis** — smooth scrolling

---

## Environment Variables

Create a `.env.local` file in the project root with these variables:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<appName>

# Admin credentials (used for login)
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password

# JWT secret (generate with: openssl rand -hex 32)
JWT_SECRET=your_jwt_secret_here
```

### How to get each value

| Variable | How to get it |
|---|---|
| `MONGODB_URI` | Go to [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → **Connect** → **Drivers** → copy the connection string. Replace `<password>` with your DB user password. |
| `ADMIN_USERNAME` | Choose any username for admin login. |
| `ADMIN_PASSWORD` | Choose a strong password for admin login. |
| `JWT_SECRET` | Run `openssl rand -hex 32` in your terminal to generate a random 64-char hex string. |

> **Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with the variables above

# 3. Start dev server (Turbopack)
npm run dev

# 4. Open http://localhost:3000
```

---

## MongoDB Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. Create a database user (Database Access → Add New Database User)
3. Whitelist your IP (Network Access → Add IP Address)
   - For Vercel: add `0.0.0.0/0` to allow all IPs
4. Create a database called **`blackrock`**
5. The app automatically uses these collections:
   - `locations` — map locations/pins
   - `businesses` — business profiles
   - `persons` — people entries

---

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
# Initialize git (if not already)
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Add all files and commit
git add .
git commit -m "production ready"

# Push to GitHub
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Set the **Root Directory** to `mapsapp` (if your repo root is the parent folder) or leave blank if `mapsapp` is the repo root
5. Framework will be auto-detected as **Next.js**
6. Add environment variables:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `ADMIN_USERNAME` | Your admin username |
   | `ADMIN_PASSWORD` | Your admin password |
   | `JWT_SECRET` | Your generated JWT secret |

7. Click **Deploy**

### 3. MongoDB Network Access

Make sure MongoDB Atlas allows connections from Vercel:
- Go to Atlas → **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

---

## Production Deployment (Self-hosted / VPS)

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/mapsapp

# 2. Install dependencies
npm install

# 3. Create .env.local with production values
nano .env.local

# 4. Build for production
npm run build

# 5. Start the production server
npm start
# Runs on port 3000 by default. Use PORT env to change:
# PORT=8080 npm start
```

### Using PM2 (recommended for VPS)

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start npm --name "blackrock" -- start

# Auto-restart on reboot
pm2 startup
pm2 save

# View logs
pm2 logs blackrock
```

### Nginx Reverse Proxy (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Git Workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Commit with a message
git commit -m "your commit message"

# Push to GitHub (triggers auto-deploy on Vercel)
git push

# Pull latest changes
git pull
```

---

## Project Structure

```
mapsapp/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main map page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles + theme
│   │   └── api/
│   │       ├── auth/             # login, logout, check
│   │       ├── locations/        # CRUD + reviews
│   │       ├── businesses/       # CRUD + reviews
│   │       └── persons/          # CRUD
│   ├── components/
│   │   ├── MapView.tsx           # Leaflet map
│   │   ├── MapControls.tsx       # Zoom, locate, add pin (admin)
│   │   ├── SearchBar.tsx         # Search with animations
│   │   ├── PlaceDetail.tsx       # Location detail panel
│   │   ├── PersonDetailPanel.tsx # Person detail panel
│   │   ├── BusinessDetailPanel.tsx
│   │   ├── BusinessProfileButton.tsx
│   │   ├── AdminPanel.tsx        # Approve/reject entries
│   │   ├── AdminLoginModal.tsx   # Admin auth modal
│   │   ├── AddLocationModal.tsx  # Add location form
│   │   ├── AddPersonModal.tsx    # Add person form
│   │   └── AddBusinessModal.tsx  # Add business form
│   └── lib/
│       ├── types.ts              # TypeScript types
│       ├── auth.ts               # JWT + admin verification
│       ├── db.ts                 # MongoDB connection
│       └── data.ts               # Default center/zoom
├── .env.local                    # Environment variables (NOT committed)
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Admin Features

- **Add locations:** When logged in as admin, a crosshair button appears on the map controls. Click it then click the map to add a pin.
- **Add businesses/persons:** Use the + buttons in the business dropdown (top-right avatar).
- **Approve entries:** Open the Admin Panel to approve or reject pending businesses and persons.
- **Toggle important:** Mark businesses/persons as important (featured).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
