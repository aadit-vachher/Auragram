// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserApi, getUserPostsApi, getAuraLogApi } from '../api/users.js';
import PostCard from '../components/PostCard.jsx';
import ScoreWidget from '../components/ScoreWidget.jsx';
import TierBadge from '../components/TierBadge.jsx';
import AuraBadge from '../components/AuraBadge.jsx';
import { formatScore, formatRelativeTime, formatDelta } from '../utils/formatScore.js';

const TABS = ['Posts', 'Aura Log'];

export function Profile() {
  const { id } = useParams();
  const { user: authUser } = useSelector((s) => s.auth);
  const isOwnProfile = authUser?._id === id;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [auraLog, setAuraLog] = useState([]);
  const [activeTab, setActiveTab] = useState('Posts');
  const [loading, setLoading] = useState(true);
  const [postsNextCursor, setPostsNextCursor] = useState(null);
  const [logNextCursor, setLogNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [user, postsData] = await Promise.all([
          getUserApi(id),
          getUserPostsApi(id),
        ]);
        setProfileUser(user);
        setPosts(postsData.posts || []);
        setPostsNextCursor(postsData.nextCursor);
      } catch (err) {
        console.error('[Profile]', err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const loadAuraLog = async () => {
    if (auraLog.length > 0) return;
    try {
      const data = await getAuraLogApi(id);
      setAuraLog(data.logs || []);
      setLogNextCursor(data.nextCursor);
    } catch (err) {
      console.error('[Profile] Aura log load failed:', err.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Aura Log') loadAuraLog();
  };

  const loadMorePosts = async () => {
    if (!postsNextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await getUserPostsApi(id, { cursor: postsNextCursor });
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setPostsNextCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="skeleton w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="skeleton h-7 w-48" />
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) return (
    <div className="text-center py-20 text-white/40">User not found</div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left col */}
        <aside className="lg:col-span-4 space-y-4">
          <ScoreWidget userId={id} />
        </aside>

        {/* Main col */}
        <main className="lg:col-span-8 space-y-5">
          {/* Profile header card */}
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <AuraBadge score={profileUser.auraScore} tier={profileUser.tier} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-display font-bold text-white">
                    {profileUser.username}
                  </h1>
                  <TierBadge tier={profileUser.tier} size="md" />
                </div>
                {profileUser.category && (
                  <p className="text-white/40 text-sm capitalize mt-1">
                    {profileUser.category} enthusiast
                  </p>
                )}
                {profileUser.globalRank && (
                  <p className="text-white/30 text-xs mt-1">
                    Global Rank: <span className="text-white/60 font-medium">#{profileUser.globalRank}</span>
                  </p>
                )}
              </div>
              {isOwnProfile && (
                <Link to="/settings" className="btn-secondary text-sm shrink-0">
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/5">
              <div className="text-center">
                <p className="text-xl font-bold text-white">{formatScore(profileUser.auraScore)}</p>
                <p className="text-xs text-white/30 mt-0.5">Aura Score</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{posts.length}+</p>
                <p className="text-xs text-white/30 mt-0.5">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">{profileUser.tier}</p>
                <p className="text-xs text-white/30 mt-0.5">Tier</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/5 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`profile-tab-${tab.replace(' ', '-').toLowerCase()}`}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-brand-400 border-brand-500'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'Posts' && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              {postsNextCursor && (
                <button onClick={loadMorePosts} disabled={loadingMore} className="btn-secondary w-full">
                  {loadingMore ? 'Loading...' : 'Load more posts'}
                </button>
              )}
              {posts.length === 0 && !loading && (
                <div className="text-center py-12 text-white/30">No posts yet</div>
              )}
            </div>
          )}

          {activeTab === 'Aura Log' && (
            <div className="space-y-3">
              {auraLog.map((log) => (
                <div key={log._id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70 capitalize">{log.reason.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-white/30">{formatRelativeTime(log.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: log.delta >= 0 ? '#22c55e' : '#ef4444' }}>
                      {formatDelta(log.delta)}
                    </p>
                    <p className="text-xs text-white/30">{formatScore(log.scoreAfter)}</p>
                  </div>
                </div>
              ))}
              {auraLog.length === 0 && (
                <div className="text-center py-12 text-white/30">No aura log entries yet</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
