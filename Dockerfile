# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
# COPY . .

# Copy the .env file into the container (if you want to include it)
# COPY .env .env

# Expose the port on which your app will run
EXPOSE 5021

# Define the command to run your application
CMD ["node", "api/api.js"]
