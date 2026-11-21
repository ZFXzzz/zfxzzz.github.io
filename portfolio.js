const copyButton = document.querySelector('[data-copy]');
const shareUrl = document.querySelector('#share-url');
const shareStatus = document.querySelector('.status');

copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    shareStatus.textContent = copyButton.dataset.copied;
  } catch {
    shareUrl.focus();
    shareUrl.select();
    shareStatus.textContent = copyButton.dataset.fallback;
  }
});
