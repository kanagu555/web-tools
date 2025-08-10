@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting KodeKit Next.js deployment...

REM Check if required environment variables are set
if "%NEXT_PUBLIC_APP_URL%"=="" (
    echo ⚠️  Warning: NEXT_PUBLIC_APP_URL is not set
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
call yarn clean

REM Install dependencies
echo 📦 Installing dependencies...
call yarn install --frozen-lockfile

REM Run type checking
echo 🔍 Running type checks...
call yarn type-check
if errorlevel 1 (
    echo ❌ Type checking failed
    exit /b 1
)

REM Run linting
echo 🔧 Running ESLint...
call yarn lint
if errorlevel 1 (
    echo ❌ Linting failed
    exit /b 1
)

REM Build the application
echo 🏗️  Building Next.js application...
call yarn build
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

REM Generate sitemap
echo 🗺️  Generating sitemap...
call npx next-sitemap

REM Run bundle analysis if requested
if "%ANALYZE%"=="true" (
    echo 📊 Running bundle analysis...
    call yarn build:analyze
)

echo 🎉 Deployment preparation complete!
echo 📋 Next steps:
echo    - Deploy to your hosting platform (Vercel, Netlify, etc.)
echo    - Update DNS settings if needed
echo    - Monitor application performance

REM If deploying to Vercel
if "%DEPLOY_TO_VERCEL%"=="true" (
    echo 🚀 Deploying to Vercel...
    call npx vercel --prod
)

pause