# React Dockerfile
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm cache clean --force
# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]

