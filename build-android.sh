#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Next.js application for Android...${NC}"

# Build Next.js application
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Next.js build successful!${NC}"
else
    echo -e "${RED}Next.js build failed!${NC}"
    exit 1
fi

# Create assets directory if it doesn't exist
mkdir -p android/app/src/main/assets/www

# Copy the built files to Android assets
echo -e "${GREEN}Copying built files to Android assets...${NC}"
cp -r out/* android/app/src/main/assets/www/

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${GREEN}Now you can:${NC}"
echo "1. Open the 'android' folder in Android Studio"
echo "2. Wait for Gradle sync to complete"
echo "3. Build and run the app"

# Make the script executable
chmod +x build-android.sh
