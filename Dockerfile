# Base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build app (Next.js will create .next folder)
RUN npm run build

# =========================
# 2) Runner stage (tối giản)
# =========================
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000


# Copy đúng phần cần thiết từ builder:
# - .next/standalone: server runtime tối thiểu (kèm node_modules cần thiết)
# - .next/static + public: asset tĩnh
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Mở port
EXPOSE 3000

# Lệnh chạy (đường dẫn server.js nằm trong .next/standalone)
CMD ["node", "server.js"]
