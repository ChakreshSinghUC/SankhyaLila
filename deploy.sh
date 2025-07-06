#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment process...${NC}"

# Step 1: Add all changes
echo -e "${BLUE}📝 Adding changes to git...${NC}"
git add .

# Step 2: Commit with timestamp
echo -e "${BLUE}💾 Committing changes...${NC}"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Update Collatz component: Remove negative axes and improve layout

- Both x and y axes now start from 0 with no negative values
- Improved chart configuration for cleaner visualization
- Auto-generation feature working smoothly
- Layout optimized with results first, input second, info third

Deployed at: $TIMESTAMP"

# Step 3: Push to repository
echo -e "${BLUE}📤 Pushing to repository...${NC}"
git push

# Check if push was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to repository${NC}"
else
    echo -e "${RED}❌ Failed to push to repository${NC}"
    exit 1
fi

# Step 4: Build and deploy
echo -e "${BLUE}🏗️  Building and deploying to GitHub Pages...${NC}"
npm run deploy

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully deployed to GitHub Pages${NC}"
    echo -e "${GREEN}🌐 Your app is live at: https://chakreshsinghuc.github.io/SankhyaLila${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment process completed successfully!${NC}"
