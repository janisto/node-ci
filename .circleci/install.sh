#!/bin/bash

echo "Installing module dependencies..."

BASE_PATH="/home/circleci/project"
MODULES="/home/circleci/project/modules"

# install module dependencies separately to save memory
cd "$MODULES"
for D in $MODULES/*; do
  if [ -d "$D" ]; then
    if [ -f "$D/package.json" ]; then
      echo "Preparing module $D..."
      cd "$D"
      npm ci
      cd ..
    fi
  fi
done

# run root install with pre/post hooks
echo "Running project npm install"
cd "$BASE_PATH"
npm ci

# Add codecov
sudo npm i -g codecov

mkdir -p reports
