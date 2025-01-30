# Use the official Node.js 20 image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]
