# Use Node.js version 20 as the base image
FROM node:25-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Run the application
CMD ["node", "dist/src/main.js"]