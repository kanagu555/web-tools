"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Grid,
  Container,
  Snackbar,
  IconButton,
  Popover,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { supabase } from "@/lib/supabase/client";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  tool_name: string;
  user_name: string;
  comment: string;
  created_at: string;
  parent_id?: string | null;
}

interface CommentsProps {
  toolName: string;
}

const Comments = ({ toolName }: CommentsProps) => {
  const theme = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    user_name: "",
    user_email: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [emojiAnchorEl, setEmojiAnchorEl] = useState<null | HTMLElement>(null);
  const [openEmoji, setOpenEmoji] = useState(false);

  const commonEmojis = [
    "😊",
    "👍",
    "❤️",
    "😂",
    "🔥",
    "🎉",
    "🙌",
    "👏",
    "😍",
    "🤔",
    "😢",
    "😡",
    "😎",
    "🤓",
    "😴",
    "🤩",
    "😱",
    "🤗",
    "🤐",
    "😇",
    "📝",
    "✨",
    "🚀",
    "💡",
    "💪",
    "🌟",
    "⭐",
    "💫",
    "🎊",
    "🎈",
  ];

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl(event.currentTarget);
    setOpenEmoji(true);
  };

  const handleEmojiClose = () => {
    setOpenEmoji(false);
    setEmojiAnchorEl(null);
  };

  const insertEmoji = (emoji: string) => {
    setNewComment((prev) => ({
      ...prev,
      comment: prev.comment + emoji + " ",
    }));
    handleEmojiClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF8A80",
  ];

  const getAvatarColor = (name: string) => {
    const hash = Math.abs(
      name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    );
    return avatarColors[hash % avatarColors.length];
  };

  useEffect(() => {
    fetchComments();
  }, [toolName]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("id, tool_name, user_name, comment, created_at, parent_id")
        .eq("tool_name", toolName)
        .is("parent_id", null) // Top-level comments only
        .order("created_at", { ascending: false });

      if (error) throw error;

      setComments(data || []);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newComment.user_name ||
      !newComment.user_email ||
      !newComment.comment.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.from("comments").insert({
        tool_name: toolName,
        user_name: newComment.user_name,
        user_email: newComment.user_email,
        comment: newComment.comment.trim(),
      });

      if (error) throw error;

      setNewComment({ user_name: "", user_email: "", comment: "" });
      setSuccess("Comment added successfully!");
      fetchComments(); // Refresh comments
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading comments...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <MessageCircle
              size={24}
              style={{
                color: theme.palette.primary.main,
                marginRight: theme.spacing(2),
              }}
            />
            <Typography variant="h4" component="h2" fontWeight={600}>
              User Comments ({comments.length})
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Snackbar
              open={!!success}
              autoHideDuration={4000}
              onClose={() => setSuccess("")}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSuccess("")}
                severity="success"
                sx={{ width: "100%" }}
              >
                {success}
              </Alert>
            </Snackbar>
          )}

          {/* Comment Form */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 4, border: `1px solid ${theme.palette.divider}` }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Leave a Comment
            </Typography>
            <Grid
              container
              spacing={2}
              component="form"
              onSubmit={handleSubmit}
            >
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={newComment.user_name}
                  onChange={(e) =>
                    setNewComment({
                      ...newComment,
                      user_name: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  type="email"
                  value={newComment.user_email}
                  onChange={(e) =>
                    setNewComment({
                      ...newComment,
                      user_email: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Your Comment"
                  multiline
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) =>
                    setNewComment({ ...newComment, comment: e.target.value })
                  }
                  required
                />
                <IconButton
                  onClick={handleEmojiClick}
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    color: "action.active",
                    zIndex: 1,
                  }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Popover
                  open={openEmoji}
                  anchorEl={emojiAnchorEl}
                  onClose={handleEmojiClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Grid container spacing={1} sx={{ p: 1, maxWidth: 300 }}>
                    {commonEmojis.map((emoji, index) => (
                      <Grid
                        item
                        xs={4}
                        key={index}
                        sx={{ textAlign: "center" }}
                      >
                        <IconButton
                          onClick={() => insertEmoji(emoji)}
                          sx={{ p: 0.5, minWidth: "auto" }}
                        >
                          <Typography variant="h4">{emoji}</Typography>
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </Popover>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    submitting ||
                    !newComment.user_name ||
                    !newComment.user_email ||
                    !newComment.comment.trim()
                  }
                  size="large"
                  fullWidth
                >
                  {submitting ? "Submitting..." : "Submit Comment"}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Comments List */}
          {comments.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                💬 No comments yet! Be the first to share your thoughts and help
                others! 🚀
              </Typography>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <List sx={{ p: 0 }}>
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        p: 3,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(comment.user_name),
                          width: 40,
                          height: 40,
                          mr: 2,
                        }}
                      >
                        {getInitials(comment.user_name)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{ mr: 1 }}
                          >
                            {comment.user_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
                        >
                          {comment.comment}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </motion.div>
                ))}
              </List>
            </Paper>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Comments;
