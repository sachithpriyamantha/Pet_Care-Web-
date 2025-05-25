import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, CornerDownRight } from 'lucide-react';

export default function ReplyList({ postId }) {
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/community/replies/${postId}`);
      setReplies(res.data);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    setIsLoading(true);
    try {
      await axios.post('/api/community/replies', {
        postId,
        content: replyText,
      });
      setReplyText('');
      fetchReplies();
    } catch (error) {
      console.error('Failed to create reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    fetchReplies();
  }, []);

  const toggleReplies = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && replies.length === 0) {
      fetchReplies();
    }
  };

  return (
    <div className="mt-2">
      <button 
        onClick={toggleReplies}
        className="text-sm text-slate-500 flex items-center hover:text-blue-600 transition-colors mb-2"
      >
        <CornerDownRight size={14} className="mr-1" />
        {isExpanded ? 'Hide replies' : `${replies.length > 0 ? replies.length : ''} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
      </button>
      
      {isExpanded && (
        <div className="pl-4 border-l-2 border-slate-100">
          <div className="flex items-center mb-3 mt-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 p-2 text-sm border border-slate-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              onClick={handleReply}
              disabled={isLoading || !replyText.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md disabled:bg-blue-300 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>

          {isLoading && replies.length === 0 ? (
            <div className="text-sm text-slate-400 py-2">Loading replies...</div>
          ) : (
            <div className="space-y-2">
              {replies.map(reply => (
                <div key={reply._id} className="bg-slate-50 p-2 rounded text-sm">
                  <div className="flex items-center mb-1">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                      {reply.user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 font-medium text-slate-700">{reply.user.username}</span>
                  </div>
                  <p className="text-slate-600 pl-8">{reply.content}</p>
                </div>
              ))}
              
              {replies.length === 0 && !isLoading && (
                <div className="text-sm text-slate-400 py-2">No replies yet. Be the first to reply!</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}