import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Image as ImageIcon, Tag, Upload, Trash2 } from 'lucide-react';
import { PostCategory } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { createPost, addToast } = useApp();

  const [postText, setPostText] = useState('');
  const [category, setCategory] = useState<PostCategory>('General');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file (PNG, JPG, WebP).', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      addToast('Image size should be under 3 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaUrl(reader.result);
        setUploadedImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) {
      addToast('Please write something before posting.', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createPost(postText.trim(), category, mediaUrl.trim() || undefined, tags);
    setPostText('');
    setCategory('General');
    setMediaUrl('');
    setUploadedImageName('');
    setTagsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold text-white">Create Campus Community Post</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Post Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as PostCategory)}
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Opportunity">Opportunity</option>
              <option value="Project">Project Showcase</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Team Formation">Team Formation</option>
              <option value="Achievement">Achievement</option>
              <option value="Discussion">Discussion</option>
              <option value="Internship">Internship Referral / Experience</option>
              <option value="Event">Campus Event</option>
              <option value="Help">Peer Help / Question</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">What&apos;s on your mind?</label>
            <textarea
              required
              rows={4}
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="Share details, hackathon prerequisites, team openings, study notes, or project milestones..."
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Optional Photo / Attachment
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 hover:text-sky-300"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {uploadedImageName ? (
              <div className="p-2.5 rounded-xl bg-[#141923] border border-[#1E293B] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-[#1E293B] shrink-0"
                  />
                  <span className="text-xs text-slate-200 truncate">{uploadedImageName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl('');
                    setUploadedImageName('');
                  }}
                  className="p-1 text-slate-400 hover:text-red-400"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="Paste image link (optional) or click Upload Image"
                  className="w-full pl-9 pr-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Hackathon, DBMS, PlacementPrep, React"
                className="w-full pl-9 pr-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20"
            >
              Post to Campus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
