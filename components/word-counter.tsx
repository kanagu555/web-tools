"use client"

import { useState, useEffect } from "react"
import { Paper, Box, Grid, Typography, TextField, IconButton, useTheme } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DeleteIcon from "@mui/icons-material/Delete"
import { useWordCounterStyles } from "@/styles/styles"
import AdSense from "./AdSense"

export function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  })
  const theme = useTheme()
  const classes = useWordCounterStyles()

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const sentences = text.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = text.split(/\n+/).filter(Boolean).length

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
    })
  }, [text])

  const handleClear = () => {
    setText("")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2} className={classes.statsGrid}>
        <StatCard label="Words" value={stats.words} xs={6} sm={4} md={2.4} />
        <StatCard label="Characters" value={stats.characters} xs={6} sm={4} md={2.4} />
        <StatCard label="No Spaces" value={stats.charactersNoSpaces} xs={6} sm={4} md={2.4} />
        <StatCard label="Sentences" value={stats.sentences} xs={6} sm={6} md={2.4} />
        <StatCard label="Paragraphs" value={stats.paragraphs} xs={6} sm={6} md={2.4} />
      </Grid>

      <Box className={classes.textFieldContainer}>
        <TextField
          fullWidth
          multiline
          minRows={12}
          maxRows={20}
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
        />
        <Box className={classes.actionButtons}>
          <IconButton size="small" onClick={handleCopy} disabled={!text} title="Copy to clipboard">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleClear} disabled={!text} title="Clear text">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  )
}

interface StatCardProps {
  label: string
  value: number
  xs?: number | boolean
  sm?: number | boolean
  md?: number | boolean
}

function StatCard({ label, value, xs = 6, sm = 4, md = 2.4 }: StatCardProps) {
  const classes = useWordCounterStyles()

  return (
    <Grid item xs={xs} sm={sm} md={md}>
      <Paper elevation={2} className={classes.statCard}>
        <Typography variant="h4" className={classes.statValue}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Paper>
    </Grid>
  )
}

