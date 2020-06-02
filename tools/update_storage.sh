#!/usr/bin/env bash

export RESOURCES=../resources
export STORAGE=../resources/storage.json

DRY_RUN=0

while test $# -gt 0
do
    case "$1" in
        --dry-run) DRY_RUN=1
            ;;
        --*) echo "bad option $1"
            ;;
    esac
    shift
done

node ./generate-storage.js

if [ $DRY_RUN -ne 1 ]; then
    git config user.email "noreply@github.com"
    git config user.name "GitHub"
    git add $STORAGE
    git commit -m 'update storage'
    git push
fi
