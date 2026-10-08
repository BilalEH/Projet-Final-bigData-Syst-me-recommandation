# Step 1: Use Node.js to build the React application
FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project and build it
COPY . .
RUN npm run build

# Step 2: Use Nginx to serve the built frontend
FROM nginx:alpine
# Note: If your project uses Vite, change /app/build to /app/dist
COPY --from=build /app/build /usr/share/nginx/html 

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]