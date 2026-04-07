#!/bin/bash
# AuraGram — 35-commit rebuild script
# Rewrites git history with atomic, story-driven commits

set -e
cd /Users/ansh/Desktop/Auragram

export GIT_EDITOR=true
export GIT_TERMINAL_PROMPT=0
git config core.editor true
git config commit.gpgsign false

echo ">>> Killing any dead lock files"
rm -f .git/index.lock
rm -f .git/COMMIT_EDITMSG.lock

echo ">>> Creating clean orphan branch"
git checkout --orphan story 2>/dev/null || true
git rm -rf --cached . -q 2>/dev/null || true

# ─────────── PHASE 1 — PROJECT SCAFFOLD ───────────

echo ">>> Commit 1"
git add docker-compose.yml .gitignore
git commit -m "add docker-compose with mongo, redis and backend services"

echo ">>> Commit 2"
git add backend/package.json backend/.env.example backend/Dockerfile
git commit -m "setup backend project with all packages and dockerfile"

echo ">>> Commit 3"
git add backend/src/config/env.js backend/src/config/db.js backend/src/config/redis.js backend/src/config/queue.js
git commit -m "wire up database, redis and queue config"

# ─────────── PHASE 2 — DATA MODELS ───────────

echo ">>> Commit 4"
git add backend/src/models/User.js
git commit -m "build the User model with aura score, tier and score history"

echo ">>> Commit 5"
git add backend/src/models/Post.js
git commit -m "build the Post model with engagements and quality score"

echo ">>> Commit 6"
git add backend/src/models/Event.js
git commit -m "add immutable Event model for all user actions"

echo ">>> Commit 7"
git add backend/src/models/AuraLog.js
git commit -m "add AuraLog model to audit every score change"

# ─────────── PHASE 3 — MIDDLEWARES AND UTILS ───────────

echo ">>> Commit 8"
git add backend/src/middlewares/auth.js
git commit -m "jwt auth middleware with silent refresh token rotation"

echo ">>> Commit 9"
git add backend/src/middlewares/rateLimit.js backend/src/middlewares/errorHandler.js
git commit -m "rate limiter and global error handler"

echo ">>> Commit 10"
git add backend/src/utils/tierMap.js backend/src/utils/constants.js backend/src/utils/helpers.js
git commit -m "tier map, constants and helper utilities"

# ─────────── PHASE 4 — AURA ENGINE ───────────

echo ">>> Commit 11"
git add backend/src/services/auraEngine.js
git commit -m "core aura engine with event weights, quality multiplier and tier assignment"

echo ">>> Commit 12"
git add backend/src/services/abuseGuard.js
git commit -m "abuse guard blocking self likes, duplicates and velocity anomalies"

echo ">>> Commit 13"
git add backend/src/services/decayService.js
git commit -m "score decay service running nightly after 7 days of inactivity"

echo ">>> Commit 14"
git add backend/src/services/leaderboardService.js backend/src/services/eventService.js
git commit -m "leaderboard hydration and event ingestion services"

# ─────────── PHASE 5 — QUEUE AND REALTIME ───────────

echo ">>> Commit 15"
git add backend/src/workers/auraWorker.js
git commit -m "bullmq worker processing aura events async with exponential retry"

echo ">>> Commit 16"
git add backend/src/socket/socketManager.js
git commit -m "socket.io manager with jwt auth, user rooms and score broadcast"

# ─────────── PHASE 6 — API ROUTES ───────────

echo ">>> Commit 17"
git add backend/src/routes/auth.js backend/src/controllers/authController.js
git commit -m "auth api: register, login, logout, refresh, get current user"

echo ">>> Commit 18"
git add backend/src/routes/users.js backend/src/controllers/usersController.js
git commit -m "users api: profile, posts, edit bio, aura log"

echo ">>> Commit 19"
git add backend/src/routes/posts.js backend/src/controllers/postsController.js
git commit -m "posts api: create, feed, like, comment, share, bookmark, report"

echo ">>> Commit 20"
git add backend/src/routes/leaderboard.js backend/src/controllers/leaderboardController.js
git commit -m "leaderboard api: global, by category, user rank"

echo ">>> Commit 21"
git add backend/src/routes/events.js backend/src/controllers/eventsController.js
git commit -m "events api: ingest action, abuse check, enqueue job, return 202"

echo ">>> Commit 22"
git add backend/src/routes/feed.js backend/src/controllers/feedController.js
git commit -m "feed api: cursor paginated home feed sorted by recency and quality"

echo ">>> Commit 23"
git add backend/server.js
git commit -m "bootstrap express server with scheduled jobs registered on startup"

echo ">>> Commit 24"
git add backend/src/seed.js
git commit -m "seed script generating 20 users, 50 posts and 200 events across all tiers"

# ─────────── PHASE 7 — FRONTEND SCAFFOLD ───────────

echo ">>> Commit 25"
git add frontend/package.json frontend/index.html frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js
git commit -m "init vite, react 18, tailwindcss and project structure"

echo ">>> Commit 26"
git add frontend/src/index.css frontend/src/main.jsx
git commit -m "global dark theme design system with tier colors and animations"

echo ">>> Commit 27"
git add frontend/src/api/axiosInstance.js frontend/src/api/auth.js frontend/src/api/posts.js frontend/src/api/users.js frontend/src/api/leaderboard.js frontend/src/api/events.js
git commit -m "axios instance with interceptors and all api modules"

echo ">>> Commit 28"
git add frontend/src/utils/tierColors.js frontend/src/utils/formatScore.js
git commit -m "tier color map and score formatter utilities"

echo ">>> Commit 29"
git add frontend/src/store/authSlice.js frontend/src/store/feedSlice.js frontend/src/store/leaderboardSlice.js frontend/src/store/uiSlice.js frontend/src/store/index.js
git commit -m "redux slices for auth, feed, leaderboard and ui state"

echo ">>> Commit 30"
git add frontend/src/context/SocketContext.jsx frontend/src/context/NotificationContext.jsx
git commit -m "socket context with jwt handshake and notification context with toast portal"

echo ">>> Commit 31"
git add frontend/src/hooks/useAura.js frontend/src/hooks/useSocket.js frontend/src/hooks/useLeaderboard.js
git commit -m "custom hooks: useAura, useSocket, useLeaderboard"

# ─────────── PHASE 8 — COMPONENTS ───────────

echo ">>> Commit 32"
git add frontend/src/components/TierBadge.jsx frontend/src/components/AuraBadge.jsx
git commit -m "aurabadge with animated radial ring and tier color mapping"

echo ">>> Commit 33"
git add frontend/src/components/ScoreWidget.jsx
git commit -m "scorewidget with svg sparkline and live socket subscription"

echo ">>> Commit 34"
git add frontend/src/components/PostCard.jsx frontend/src/components/CreatePost.jsx
git commit -m "postcard with all engagement actions wired to the events pipeline"

echo ">>> Commit 35"
git add frontend/src/components/LeaderboardTable.jsx
git commit -m "leaderboard table with global and category tabs, rank change animation"

echo ">>> Commit 36"
git add frontend/src/components/Navbar.jsx frontend/src/components/NotificationPanel.jsx frontend/src/components/Feed.jsx
git commit -m "navbar, notification panel with tier-change toast, and feed layout"

# ─────────── PHASE 9 — PAGES ───────────

echo ">>> Commit 37"
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx
git commit -m "login and register pages with category select on signup"

echo ">>> Commit 38"
git add frontend/src/pages/Home.jsx
git commit -m "home feed page with three column layout and category filter"

echo ">>> Commit 39"
git add frontend/src/pages/Profile.jsx
git commit -m "profile page with scorewidget, posts tab and aura log tab"

echo ">>> Commit 40"
git add frontend/src/pages/Leaderboard.jsx
git commit -m "leaderboard page with podium top three and live socket updates"

echo ">>> Commit 41"
git add frontend/src/pages/PostPage.jsx
git commit -m "post page with full post view and cursor paginated comments"

echo ">>> Commit 42"
git add frontend/src/App.jsx
git commit -m "react router v6 with protected routes and auth bootstrap on load"

# ─────────── REPLACE MASTER ───────────

echo ">>> Replacing master branch"
git branch -D master 2>/dev/null || true
git branch -m story master

echo ">>> Force pushing to origin"
git push -f origin master 2>&1

echo ""
echo "================ DONE ================"
git log --oneline
