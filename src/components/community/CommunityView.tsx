import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Pin,
  TrendingUp
} from 'lucide-react';
import { PostCategory } from '../../types';

interface CommunityViewProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ setIsCreateOpen }) => {
  const { 
    currentUser, 
    posts, 
    toggleLikePost, 
    toggleSavePost, 
    setActivePostDetail, 
    navigateToProfile,
    addToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'recent' | 'trending'>('recent');

  const categories: (PostCategory | 'All')[] = [
    'All',
    'Opportunity',
    'Project',
    'Hackathon',
    'Team Formation',
    'Achievement',
    'Discussion',
    'Internship',
    'Event',
    'Help',
    'General'
  ];

  // Filter & sort
  let displayedPosts = posts.filter(p => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  if (filterType === 'trending') {
    displayedPosts = [...displayedPosts].sort((a, b) => (b.likes + b.commentsCount) - (a.likes + a.commentsCount));
  } else {
    displayedPosts = [...displayedPosts].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }

  const handleShare = (postId: string) => {
    navigator.clipboard?.writeText(window.location.origin + '?post=' + postId);
    addToast('Post link copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Campus Community
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student-driven updates, opportunities, hackathon team formation, and project milestones.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 shrink-0 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Campus Post</span>
        </button>
      </div>

      {/* Quick Post Prompt Card */}
      {currentUser && (
        <div 
          onClick={() => setIsCreateOpen(true)}
          className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/40 cursor-pointer transition-all flex items-center gap-3"
        >
          <img
            src={currentUser.profilePhoto}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20 shrink-0"
          />
          <div className="flex-1 py-2 px-4 rounded-xl bg-[#141923] text-xs text-slate-400 hover:text-slate-200 border border-[#1E293B] truncate">
            Share an opportunity, project milestone, or team request with fellow students...
          </div>
          <button className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold shrink-0">
            Post
          </button>
        </div>
      )}

      {/* Categories & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-[#0F131C] text-slate-400 border border-[#1E293B] hover:text-slate-200 hover:bg-[#141923]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Recent vs Trending toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#0F131C] border border-[#1E293B] rounded-xl self-start sm:self-auto shrink-0 text-xs">
          <button
            onClick={() => setFilterType('recent')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              filterType === 'recent'
                ? 'bg-[#141923] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilterType('trending')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              filterType === 'trending'
                ? 'bg-[#141923] text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Feed List */}
      {displayedPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No community posts in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first student to start a discussion or announce a campus opportunity!
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-sky-500 text-slate-950 text-xs font-bold rounded-xl shadow-md"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedPosts.map(post => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-slate-700 transition-all space-y-3"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => navigateToProfile(post.studentId)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={post.studentAvatar}
                    alt={post.studentName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-sky-400 transition-colors">
                      {post.studentName}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {post.studentBranchYear} · <span className="text-slate-500">{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p
                onClick={() => setActivePostDetail(post)}
                className="text-xs sm:text-sm text-slate-200 leading-relaxed cursor-pointer hover:text-white"
              >
                {post.content}
              </p>

              {/* Media image */}
              {post.mediaUrl && (
                <div
                  onClick={() => setActivePostDetail(post)}
                  className="rounded-xl overflow-hidden max-h-72 border border-[#1E293B] cursor-pointer"
                >
                  <img
                    src={post.mediaUrl}
                    alt="Post attached media"
                    className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-slate-400 bg-[#141923] px-2 py-0.5 rounded border border-[#1E293B]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]/70 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.hasLiked ? 'text-red-400 font-semibold' : 'hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setActivePostDetail(post)}
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} comments</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSavePost(post.id)}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      post.saved
                        ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                        : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-white'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="p-1.5 rounded-lg bg-[#141923] text-slate-400 border border-[#1E293B] hover:text-white transition-colors"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActivePostDetail(post)}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium ml-1"
                  >
                    View &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
