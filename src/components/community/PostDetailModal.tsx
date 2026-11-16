import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Flag, 
  Send, 
  Trash2, 
  User, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { Post } from '../../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { 
    currentUser, 
    toggleLikePost, 
    addComment, 
    deleteComment, 
    toggleSavePost, 
    reportPost, 
    deletePost, 
    navigateToProfile, 
    addToast 
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportReason, setReportReason] = useState('');

  if (!post) return null;

  const isAuthor = currentUser?.id === post.studentId;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '?post=' + post.id);
    addToast('Post link copied to clipboard!');
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    reportPost(post.id, reportReason.trim());
    setShowReportInput(false);
    setReportReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {post.category}
            </span>
            <span className="text-xs text-slate-500">· {post.createdAt}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <button
                onClick={() => {
                  deletePost(post.id);
                  onClose();
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1.5"
                title="Delete your post"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Author info */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => {
                onClose();
                navigateToProfile(post.studentId);
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={post.studentAvatar}
                alt={post.studentName}
                className="w-11 h-11 rounded-xl object-cover ring-1 ring-sky-500/20"
              />
              <div>
                <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-sky-400 transition-colors">
                  {post.studentName}
                </h3>
                <p className="text-xs text-slate-400">
                  {post.studentBranchYear} · Roll: {post.studentRoll}
                </p>
              </div>
            </div>
          </div>

          {/* Post content */}
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Optional Media */}
          {post.mediaUrl && (
            <div className="rounded-xl overflow-hidden border border-[#1E293B]">
              <img src={post.mediaUrl} alt="Post Attachment" className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between py-3 border-y border-[#1E293B] text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleLikePost(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.hasLiked ? 'text-red-400 font-semibold' : 'hover:text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                <span>{post.likes} Likes</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-400">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>{post.commentsCount} Comments</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSavePost(post.id)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  post.saved
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                    : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-white'
                }`}
                title="Save Post"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg bg-[#141923] text-slate-400 border border-[#1E293B] hover:text-white transition-colors"
                title="Share Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowReportInput(!showReportInput)}
                className="p-1.5 rounded-lg bg-[#141923] text-slate-400 border border-[#1E293B] hover:text-red-400 transition-colors"
                title="Report Post"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inline Report Input */}
          {showReportInput && (
            <form onSubmit={handleReport} className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-red-300">Report Inappropriate Student Post</div>
              <input
                type="text"
                required
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="Reason: e.g. spam, cheating material, harassment..."
                className="w-full px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportInput(false)}
                  className="px-2.5 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}

          {/* Comments Section */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Discussion ({post.comments.length})
            </h4>

            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No comments yet. Start the conversation!</p>
            ) : (
              <div className="space-y-2.5">
                {post.comments.map(c => {
                  const isCommentOwner = currentUser?.id === c.studentId;
                  return (
                    <div key={c.id} className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] space-y-1 relative group">
                      <div className="flex items-center justify-between">
                        <div 
                          onClick={() => {
                            onClose();
                            navigateToProfile(c.studentId);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <img src={c.studentAvatar} alt={c.studentName} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="text-xs font-bold text-slate-200 hover:text-sky-400 transition-colors">
                            {c.studentName}
                          </span>
                          <span className="text-[11px] text-slate-500">· {c.studentBranchYear}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                          {isCommentOwner && (
                            <button
                              onClick={() => deleteComment(post.id, c.id)}
                              className="text-slate-600 hover:text-red-400 transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Comment Input Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0A0D15]">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              required
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Share advice, feedback, or response..."
              className="flex-1 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>Comment</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
