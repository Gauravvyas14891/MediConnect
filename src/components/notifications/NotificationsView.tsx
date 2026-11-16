import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Heart, 
  MessageSquare, 
  Trophy, 
  Flame, 
  UserPlus, 
  Sparkles,
  Megaphone,
  Check
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setActiveTab, 
    navigateToProfile 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-400 fill-red-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-teal-400" />;
      case 'challenge':
        return <Flame className="w-4 h-4 text-purple-400" />;
      case 'badge':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'leaderboard':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-sky-400" />;
    }
  };

  const handleAction = (n: any) => {
    markNotificationAsRead(n.id);
    if (n.type === 'leaderboard') {
      setActiveTab('leaderboard');
    } else if (n.type === 'challenge') {
      setActiveTab('challenges');
    } else if (n.type === 'badge' || n.type === 'follow') {
      navigateToProfile();
    } else {
      setActiveTab('community');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
              Notification Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay informed on peer endorsements, challenge status, discussions, and ranking milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-xs font-semibold text-sky-400 rounded-xl transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'bg-[#0F131C] text-slate-400 border border-[#1E293B]'
          }`}
        >
          All Activity ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'bg-[#0F131C] text-slate-400 border border-[#1E293B]'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* List */}
      {filteredNotifs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-2">
          <CheckCheck className="w-10 h-10 text-emerald-500/60 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">You're all caught up!</h3>
          <p className="text-xs text-slate-500">No new notifications right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1E293B] rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden shadow-lg">
          {filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => handleAction(n)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer group ${
                !n.read ? 'bg-sky-500/[0.04] hover:bg-sky-500/[0.08]' : 'hover:bg-[#141923]/60'
              }`}
            >
              {/* Avatar or Icon */}
              <div className="relative shrink-0">
                {n.avatar ? (
                  <img
                    src={n.avatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#141923] border border-[#1E293B] flex items-center justify-center">
                    {getIcon(n.type)}
                  </div>
                )}
                {!n.read && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full ring-2 ring-[#0F131C]" />
                )}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#F8FAFC] group-hover:text-sky-400 transition-colors">
                    {n.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{n.createdAt}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
