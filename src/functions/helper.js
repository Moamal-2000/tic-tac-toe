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
  return (
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.msRequestFullscreen
  );
}

export function enterFullScreen() {
  if (typeof document === "undefined") return false;

  const htmlElement = document.documentElement;

  if (htmlElement.requestFullscreen) htmlElement.requestFullscreen();
  else if (htmlElement.mozRequestFullScreen) htmlElement.mozRequestFullScreen();
  else if (htmlElement.webkitRequestFullscreen)
    htmlElement.webkitRequestFullscreen();
  else if (htmlElement.msRequestFullscreen) htmlElement.msRequestFullscreen();
}

export function refreshPage() {
  window.location.reload();
}
