export const DRAWER_HASH_IDS = ["about", "services"];

export function getHashId() {
  return window.location.hash.replace(/^#/, "");
}

export function isDrawerHash(hashId = getHashId()) {
  return DRAWER_HASH_IDS.includes(hashId);
}

export function getDrawerFromHash() {
  const hashId = getHashId();
  return isDrawerHash(hashId) ? hashId : null;
}

export function setHash(id) {
  const next = `#${id}`;
  if (window.location.hash !== next) {
    window.location.hash = id;
  }
}

export function clearDrawerHash() {
  if (isDrawerHash()) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#home`
    );
  }
}
