let lockCount = 0;
let savedStyles = null;

/** Prevent page scroll while overlays are open. Ref-counted for safe stacking. */
export function lockBodyScroll() {
  if (lockCount === 0) {
    const { documentElement, body } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    savedStyles = {
      htmlOverflow: documentElement.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight
    };

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0 && savedStyles) {
      document.documentElement.style.overflow = savedStyles.htmlOverflow;
      document.body.style.overflow = savedStyles.bodyOverflow;
      document.body.style.paddingRight = savedStyles.bodyPaddingRight;
      savedStyles = null;
    }
  };
}
