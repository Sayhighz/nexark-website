import React from 'react'

const YouTubeEmbed = ({
  videoId = "dQw4w9WgXcQ",
  title = "YouTube Video",
  className = "",
  autoplay = true,
  mute = true,
  loop = true,
  controls = false,
  modestBranding = true,
  relatedVideos = false,
  width = "100%",
  height = "100%"
}) => {
  const src = `https://www.youtube.com/embed/${videoId}?` + new URLSearchParams({
    autoplay: autoplay ? 1 : 0,
    mute: mute ? 1 : 0,
    loop: loop ? 1 : 0,
    playlist: loop ? videoId : undefined,
    controls: controls ? 1 : 0,
    modestbranding: modestBranding ? 1 : 0,
    rel: relatedVideos ? 1 : 0,
  }).toString()

  return (
    <iframe
      className={className}
      width={width}
      height={height}
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

export default YouTubeEmbed