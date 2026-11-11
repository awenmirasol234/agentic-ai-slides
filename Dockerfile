FROM nginxinc/nginx-unprivileged:1.27-alpine

WORKDIR /usr/share/nginx/html

# Replace default server config with presentation rules & shared security header include
COPY --chown=nginx:nginx nginx/security-headers.conf /etc/nginx/includes/security-headers.conf
COPY --chown=nginx:nginx nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy only runtime deck assets into web root
COPY --chown=nginx:nginx index.html presentation.css presentation.js ./
COPY --chown=nginx:nginx icons/ ./icons/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
