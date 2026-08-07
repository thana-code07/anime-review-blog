const listeners = new Set();

export function subscribeAuthCleared(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitAuthCleared() {
  for (const listener of listeners) {
    listener();
  }
}
