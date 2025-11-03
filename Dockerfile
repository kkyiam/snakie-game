FROM nginx:alpine

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/

# Copy documentation files (optional, for reference)
COPY README.md /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
