let noticeTimeout;

export function showNotice(message, isError = false) {
  const notice = document.getElementById('appNotice');
  notice.textContent = message;
  notice.classList.toggle('is-error', isError);
  notice.classList.remove('d-none');
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => notice.classList.add('d-none'), 3600);
}
