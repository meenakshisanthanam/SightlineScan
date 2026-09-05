#!/usr/bin/env bash
set -o errexit

npm install

export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p "$PUPPETEER_CACHE_DIR"

npx puppeteer browsers install chrome

if [[ ! -d "$PUPPETEER_CACHE_DIR" ]]; then
  echo "...Copying Puppeteer Cache from Build Cache"
  cp -R /opt/render/project/src/.cache/puppeteer/ "$PUPPETEER_CACHE_DIR"
else
  echo "...Storing Puppeteer Cache in Build Cache"
  mkdir -p /opt/render/project/src/.cache/puppeteer/
  cp -R "$PUPPETEER_CACHE_DIR/" /opt/render/project/src/.cache/puppeteer/
fi
