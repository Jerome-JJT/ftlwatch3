

export function createAuthorizeURL(): string {
  const current = window.location.pathname+window.location.search;
  if (!current.includes("loginapi")) {
    return `/api/?page=login&action=authorizeapi&next=${encodeURIComponent(current)}`;
  }
  return `/api/?page=login&action=authorizeapi`;
}
