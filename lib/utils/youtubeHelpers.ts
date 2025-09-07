export interface ThumbnailQuality {
  name: string;
  url: string;
  width: number;
  height: number;
  description: string;
}

export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const generateThumbnailUrls = (videoId: string): ThumbnailQuality[] => [
  {
    name: "maxresdefault",
    url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    width: 1280,
    height: 720,
    description: "Maximum Resolution (1280x720)"
  },
  {
    name: "sddefault",
    url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    width: 640,
    height: 480,
    description: "Standard Definition (640x480)"
  },
  {
    name: "hqdefault",
    url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    width: 480,
    height: 360,
    description: "High Quality (480x360)"
  },
  {
    name: "mqdefault",
    url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    width: 320,
    height: 180,
    description: "Medium Quality (320x180)"
  },
  {
    name: "default",
    url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    width: 120,
    height: 90,
    description: "Default (120x90)"
  }
];

export const validateYouTubeUrl = (url: string): boolean => {
  return extractVideoId(url) !== null;
};