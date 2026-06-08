"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Star, MessageCircle, Send, X } from "lucide-react"
import { toggleLike, toggleFavorite, addComment } from "@/app/media/action"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

type MediaCardProps = {
  media: any
  currentUserId?: string
}

export function MediaCard({ media, currentUserId }: MediaCardProps) {
  const pathname = usePathname()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const hasLiked = media.likes?.some((like: any) => like.userId === currentUserId)
  const hasFavorited = media.favorites?.some((fav: any) => fav.userId === currentUserId)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!currentUserId) return toast.error("Please log in to like")
    setIsLiking(true)
    const res = await toggleLike(media.id, pathname)
    if (res.error) toast.error(res.error)
    setIsLiking(false)
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!currentUserId) return toast.error("Please log in to favorite")
    setIsFavoriting(true)
    const res = await toggleFavorite(media.id, pathname)
    if (res.error) toast.error(res.error)
    setIsFavoriting(false)
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) return toast.error("Please log in to comment")
    if (!commentText.trim()) return
    setIsCommenting(true)
    const res = await addComment(media.id, commentText, pathname)
    if (res.error) {
      toast.error(res.error)
    } else {
      setCommentText("")
      toast.success("Comment added")
    }
    setIsCommenting(false)
  }

  return (
    <>
      <div className="break-inside-avoid rounded-xl overflow-hidden bg-white/5 border border-white/10 group relative mb-4 shadow-xl">
        {media.type === "IMAGE" ? (
          <img src={media.url} alt="Media" className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <video src={media.url} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" controls />
        )}
        
        {/* Interaction Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button 
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center space-x-1.5 text-white hover:text-pink-400 transition"
              >
                <Heart className={`w-5 h-5 ${hasLiked ? "fill-pink-500 text-pink-500" : ""}`} />
                <span className="text-sm font-medium">{media.likes?.length || 0}</span>
              </button>
              
              <button 
                onClick={(e) => { e.preventDefault(); setShowComments(true); }}
                className="flex items-center space-x-1.5 text-white hover:text-indigo-400 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{media.comments?.length || 0}</span>
              </button>
            </div>
            
            <button 
              onClick={handleFavorite}
              disabled={isFavoriting}
              className="text-white hover:text-yellow-400 transition"
            >
              <Star className={`w-5 h-5 ${hasFavorited ? "fill-yellow-500 text-yellow-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[600px]"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-semibold text-lg">Comments</h3>
                <button onClick={() => setShowComments(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {media.comments && media.comments.length > 0 ? (
                  media.comments.map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <span className="text-indigo-400 text-xs font-bold">{comment.user.name?.charAt(0) || "U"}</span>
                      </div>
                      <div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2 text-sm">
                          <span className="font-semibold text-indigo-300 block mb-1">{comment.user.name}</span>
                          <span className="text-white/90">{comment.content}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-white/40">
                    <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No comments yet. Be the first!</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/40">
                <form onSubmit={handleAddComment} className="flex relative">
                  <input 
                    type="text" 
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button 
                    type="submit" 
                    disabled={isCommenting || !commentText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/10 disabled:text-white/30 flex items-center justify-center transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
