#!/usr/bin/env bash

echo "{\"test\":[[]]}" | cat > ./resources/storage.json
git config user.email "noreply@github.com"
git config user.name "GitHub"
git add ./resources/storage.json
git commit -m 'update storage'
git push