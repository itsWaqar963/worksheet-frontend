import React, { useState, useEffect } from "react";
import WorksheetCard from "./WorksheetCard";

export default function WorksheetGrid({ worksheets, likedWorksheets, likesMap, onLike }) {
  const getInitialCount = () => {
    if (window.innerWidth < 600) return 3;
    if (window.innerWidth < 900) return 6;
    return 12;
  };
  const [visibleCount, setVisibleCount] = useState(getInitialCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getInitialCount());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + getInitialCount());
  };

  const visibleWorksheets = worksheets.slice(0, visibleCount);

  return (
    <>
      <div className="ws-grid">
        {visibleWorksheets.map((w) => (
          <WorksheetCard
            key={w._id}
            worksheet={w}
            liked={likedWorksheets.includes(w._id)}
            likeCount={likesMap[w._id] ?? 0}
            onLike={onLike}
          />
        ))}
      </div>
      {visibleCount < worksheets.length && (
        <button className="ws-load-more" onClick={handleLoadMore}>
          Load More Worksheets
        </button>
      )}
    </>
  );
} 