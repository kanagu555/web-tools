import React, { useState } from "react";

const YouTubeThumbnail = () => {
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");

  // Extract YouTube video ID from the URL
  const extractVideoID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle video URL input
  const handleInputChange = (e) => {
    const url = e.target.value;
    setVideoURL(url);

    const videoID = extractVideoID(url);
    if (videoID) {
      const thumbnail = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
      setThumbnailURL(thumbnail);
    } else {
      setThumbnailURL("");
    }
  };

  // Download thumbnail
  const downloadThumbnail = () => {
    if (thumbnailURL) {
      const link = document.createElement("a");
      link.href = thumbnailURL;
      link.download = "youtube-thumbnail.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>YouTube Thumbnail Viewer & Downloader</h2>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoURL}
        onChange={handleInputChange}
        style={{ width: "300px", padding: "10px" }}
      />
      <br />
      {thumbnailURL && (
        <div style={{ marginTop: "20px" }}>
          <img src={thumbnailURL} alt="YouTube Thumbnail" width="480" />
          <br />
          <button
            onClick={downloadThumbnail}
            style={{ marginTop: "10px", padding: "10px 20px" }}
          >
            Download Thumbnail
          </button>
        </div>
      )}
    </div>
  );
};

export default YouTubeThumbnail;
