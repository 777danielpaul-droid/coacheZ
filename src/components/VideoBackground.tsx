export function VideoBackground() {
  return (
    <div className="video-bg" aria-hidden="true">
      <video
        className="video-bg__video"
        src="fireworx.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="video-bg__scrim" />
    </div>
  )
}
