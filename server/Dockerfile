# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Install Python as well (for Python challenges)
RUN apt-get update && apt-get install -y python3 python3-pip

# Set the working directory inside the container to /server
WORKDIR /server

# Copy the contents of the current directory (server) into /server in the container
COPY . .

# Install any needed Python packages (if you have a requirements.txt)
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Install Node.js packages
RUN npm install

# The container will run with a default command, but we will override it in the Node.js script
CMD ["bash"]
