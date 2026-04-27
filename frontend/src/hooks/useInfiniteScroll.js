import { useEffect } from "react";


export function useInfiniteScroll(onScrollEnd, isCargando, hasMore, offset = 200) {
  useEffect(() => {
    const manejarScroll = () => {
      if (isCargando || !hasMore) return;

      if (
        window.innerHeight + document.documentElement.scrollTop + offset >=
        document.documentElement.offsetHeight
      ) {
        onScrollEnd();
      }
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, [onScrollEnd, isCargando, hasMore, offset]);
}
