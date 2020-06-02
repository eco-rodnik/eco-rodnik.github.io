#!/usr/bin/env bash

echo "{}" | cat > ./resources/storage.json
git config user.email "andrew.ryazantsev@gmail.com"
git config user.name "Andrew Ryazantsev"
git add ./resources/storage.json
git commit -m 'update storage'
git push