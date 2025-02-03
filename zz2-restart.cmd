cd %~dp0
npm run off
git fetch origin
git reset --hard origin/main
npm i && npm run build
npm run start