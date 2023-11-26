# Specify the base image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /pages

# Copy the package.json and package-lock.json files to the container
COPY package.json ./

# Install dependencies
# RUN yarn install
RUN yarn install --frozen-lockfile
# RUN yarn install serve
RUN yarn cache clean

# Copy the rest of the application code to the container
COPY . .


# Expose port 2203
EXPOSE 2203

# Start the server
CMD ["yarn", "run:dev"]
