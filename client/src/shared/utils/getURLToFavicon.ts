export const isValidURL =
  /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const getExternalLink = (url: string): string => {
  const newUrl = url.replace(/ /g, '');
  if (newUrl.startsWith('//') || newUrl.startsWith('http')) {
    return newUrl;
  }
  return `//${newUrl}`;
};

export const getURLToFavicon = async (url: string): Promise<string | null> => {
  if (!isValidURL.test(url)) return null;
  const normalizedUrl = getExternalLink(url);
  const faviconUrl = `${new URL(normalizedUrl).origin}/favicon.ico`;
  try {
    const img = new Image();
    img.src = faviconUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    return faviconUrl;
  } catch {
    return null;
  }
};
