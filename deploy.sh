#!/bin/bash

# Update package list and install Node.js if not installed
if ! command -v node &> /dev/null
then
    echo "Node.js could not be found. Installing Node.js..."
    # This command may vary based on your hosting environment
    # For Ubuntu, you can use the following commands:
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the application
echo "Starting the application..."
npm start
