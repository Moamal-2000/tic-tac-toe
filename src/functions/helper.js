export function isStandalone() {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  );
}

export function isIOS() {
  if (typeof window === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isInStandaloneMode() {
  if (typeof window === "undefined") return false;

  return (
    window.navigator.standalone ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function isFullScreenSupported() {
  if (typeof document === "undefined") return true;

  return (
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.msRequestFullscreen
  );
}

export function enterFullScreen() {
  if (typeof document === "undefined") return false;

  const root = document.documentElement;

  if (root.requestFullscreen) root.requestFullscreen();
  else if (root.mozRequestFullScreen) root.mozRequestFullScreen();
  else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
  else if (root.msRequestFullscreen) root.msRequestFullscreen();
}

export function refreshPage() {
  window.location.reload();
}

export function stopTimer(ref) {
  if (ref.current) {
    clearInterval(ref.current);
    ref.current = null;
  }
}

export function scrollToElementBottom(ref) {
  ref.current?.scrollIntoView({ behavior: "smooth" });
}
