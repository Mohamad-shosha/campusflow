import canvasConfetti from 'canvas-confetti';

type Fire = (options?: canvasConfetti.Options) => void;

let instance: Fire | null = null;

/**
 * Celebration confetti that works under the strict CSP (script-src 'self'): the library's default
 * export renders in a Web Worker created from a blob: URL, which the CSP blocks. A main-thread
 * instance needs no worker. Created lazily on first use; purely cosmetic, so failures are ignored.
 */
export const confetti: Fire = options => {
  try {
    if (!instance) {
      instance =
        typeof canvasConfetti.create === 'function'
          ? (canvasConfetti.create(undefined, { resize: true, useWorker: false }) as Fire)
          : (canvasConfetti as unknown as Fire);
    }
    instance(options);
  } catch {
    // cosmetic only
  }
};
