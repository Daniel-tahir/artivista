import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TARGET_OBSERVER_TIMEOUT_MS = 10000;

const scrollToHashTarget = (hash: string) => {
  const targetId = hash.replace(/^#/, "");
  const target = document.getElementById(targetId);

  if (!target) return false;

  const header = document.querySelector("header");
  const headerOffset = header instanceof HTMLElement ? header.offsetHeight + 16 : 0;
  const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    });
  });

  return true;
};

const HashScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    if (scrollToHashTarget(location.hash)) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (!scrollToHashTarget(location.hash)) {
        return;
      }

      observer.disconnect();
      window.clearTimeout(timeoutId);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const timeoutId = window.setTimeout(() => {
      observer.disconnect();
    }, TARGET_OBSERVER_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  return null;
};

export default HashScrollHandler;
