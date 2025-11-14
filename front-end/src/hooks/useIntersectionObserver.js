import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for Intersection Observer
 * Detects when an element enters/exits the viewport
 * 
 * @param {object} options - Intersection Observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef(null);
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen.current || !element) {
      return;
    }

    const observerOptions = { threshold, root, rootMargin };

    const updateEntry = (entries) => {
      const [entry] = entries;
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true;
      }
    };

    const observer = new IntersectionObserver(updateEntry, observerOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, isIntersecting, entry];
};

/**
 * Hook for lazy loading images
 * @param {object} options - Options
 * @returns {Array} [ref, isVisible]
 */
export const useLazyLoad = (options = {}) => {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  return [ref, isIntersecting];
};

/**
 * Hook for scroll-triggered animations
 * @param {object} options - Animation options
 * @returns {Array} [ref, isVisible]
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.2, triggerOnce = true } = options;
  
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    freezeOnceVisible: triggerOnce,
  });

  return [ref, isIntersecting];
};

/**
 * Hook for infinite scroll
 * @param {Function} callback - Function to call when element is visible
 * @param {object} options - Options
 * @returns {ref} Element ref
 */
export const useInfiniteScroll = (callback, options = {}) => {
  const { threshold = 1.0, rootMargin = '0px' } = options;
  
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isIntersecting && callback) {
      callback();
    }
  }, [isIntersecting, callback]);

  return ref;
};

/**
 * Hook to detect if element is in viewport
 * @param {object} options - Options
 * @returns {Array} [ref, isInViewport]
 */
export const useIsInViewport = (options = {}) => {
  const { threshold = 0.5 } = options;
  
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
  });

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
