#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Preparing Android Kotlin project...${NC}"

# Remove old Java files
rm -rf android/app/src/main/java

# Build Next.js application
echo -e "${GREEN}Building Next.js application...${NC}"
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

# Create local.properties file with SDK path if it doesn't exist
if [ ! -f android/local.properties ]; then
    echo -e "${GREEN}Creating local.properties...${NC}"
    echo "sdk.dir=$ANDROID_HOME" > android/local.properties
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${GREEN}To build the Android app:${NC}"
echo "1. Open the 'android' folder in Android Studio"
echo "2. Wait for Gradle sync to complete"
echo "3. Select Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "4. The APK will be generated in android/app/build/outputs/apk/debug/"

# Make the script executable
chmod +x build-android.sh
