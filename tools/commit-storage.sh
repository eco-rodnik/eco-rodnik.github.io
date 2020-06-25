#!/usr/bin/env bash

git config user.email "noreply@github.com"
git config user.name "GitHub"
git add ../src/storage.json
git commit -m 'update storage'
git push
