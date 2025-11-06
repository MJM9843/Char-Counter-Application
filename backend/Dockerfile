# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json (package-lock.json will be copied if it exists)
COPY package.json ./

# Install dependencies without requiring package-lock.json
RUN npm install --production

# Copy application code
COPY server.js ./

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
