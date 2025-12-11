# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining project files
COPY . .

# Expose your backend port (change if yours is different)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
