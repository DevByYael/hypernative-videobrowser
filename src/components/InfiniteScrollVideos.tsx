import React, { useEffect, useState, useRef } from "react";
import type { Video } from '../types/video';

const PAGE_LIMIT = 30;
const DATA_URL =
  "https://raw.githubusercontent.com/XiteTV/frontend-coding-exercise/main/data/dataset.json";

export default function InfiniteScrollVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextCursor, setNextCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = async (cursor = 0, limit = PAGE_LIMIT) => {
    setIsLoading(true);
    const res = await fetch(DATA_URL);
    const json = await res.json();

    // Simulate cursor (based on ID > cursor)
    const all = json.videos;
    const nextBatch = all
      .filter((video: Video) => video.id > cursor)
      .slice(0, limit);

    setVideos((prev) => [...prev, ...nextBatch]);
    setNextCursor(nextBatch.length ? nextBatch[nextBatch.length - 1].id : null);
    setHasMore(nextBatch.length === limit);
    setIsLoading(false);
  };

  // Initial load
  useEffect(() => {
    fetchVideos(0);
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchVideos(nextCursor);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current as Element);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current as Element);
    };
  }, [nextCursor, hasMore, isLoading]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🎥 Infinite Scroll Videos</h1>
      <ul className="space-y-3">
        {videos.map((video) => (
          <li
            key={video.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <span>{video.title}</span>
            <small className="text-gray-500">ID: {video.id}</small>
          </li>
        ))}
      </ul>

      <div ref={observerRef} className="h-12 flex items-center justify-center">
        {isLoading && <span>Loading...</span>}
        {!hasMore && <span className="text-gray-500">No more videos</span>}
      </div>
    </div>
  );
}