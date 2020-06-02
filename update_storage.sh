#!/usr/bin/env bash

echo "{}" | cat > ./resources/storage.json
git add ./resources/storage.json
git commit -m 'update storage'
git push