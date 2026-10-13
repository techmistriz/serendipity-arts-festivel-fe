export default function MovePage() {
  return (
    <main className="fixed inset-0 z-[9999] h-dvh w-screen overflow-hidden bg-black">
      <video
        className="h-full w-full object-contain"
        autoPlay
        muted
        playsInline
        controls
        preload="auto"
      >
        <source src="/animations/move.mp4" type="video/mp4" />
        Your browser does not support HTML video.
      </video>
    </main>
  );
}
