# ---------- base: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
# Hanya file lock & manifest supaya cache build stabil
COPY package*.json ./
# Install semua deps (termasuk dev) buat proses build Vite
RUN npm ci

# ---------- dev ----------
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Pastikan build fail terlihat (tanpa --silent)
RUN npm run build

# ---------- production ----------
FROM nginx:alpine AS production
# Salin artifact statis
COPY --from=build /app/dist /usr/share/nginx/html
# Salin konfigurasi nginx khusus SPA
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80