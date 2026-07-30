let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  const installButton = document.getElementById('installApp');
  if (installButton) installButton.hidden = false;
});
window.addEventListener('appinstalled', () => {
  const installButton = document.getElementById('installApp');
  if (installButton) installButton.hidden = true;
  deferredInstallPrompt = null;
});
document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('installApp');
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installButton.hidden = true;
    });
  }
});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}