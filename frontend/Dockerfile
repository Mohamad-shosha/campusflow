# ==============================================================================
# Stage 1: Build the React Application
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . ./
RUN npm run build

# ==============================================================================
# Stage 2: Serve using high-performance Nginx Alpine
# ==============================================================================
FROM nginx:1.27-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

