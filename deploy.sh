#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd .vuepress/dist

# if you are deploying to a custom domain
# echo 'www.confetti-framework.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:confetti-framework/docs.git master:gh-pages

echo 'https://confetti-framework.github.io/docs/'

cd -
