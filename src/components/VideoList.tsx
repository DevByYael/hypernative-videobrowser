import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Video } from '../types/video';
import { VideoCard } from './VideoCard';

interface VideoListProps {
  videos: Video[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export const VideoList = ({ videos, isLoading = false }: VideoListProps) => {
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);
  const prevVideosRef = useRef<Video[]>([]);

  const loadMore = useCallback(() => {
    if (isLoading || loadingRef.current || displayedVideos.length >= videos.length) {
      return;
    }

    loadingRef.current = true;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    const end = nextPage * ITEMS_PER_PAGE;
    const newVideos = videos.slice(0, end);

    setDisplayedVideos(newVideos);
    setPage(nextPage);
    setIsLoadingMore(false);
    loadingRef.current = false;
  }, [isLoading, displayedVideos.length, videos, page]);

  useEffect(() => {
    const videosChanged = JSON.stringify(videos) !== JSON.stringify(prevVideosRef.current);
    if (videosChanged) {
      setPage(1);
      setDisplayedVideos(videos.slice(0, ITEMS_PER_PAGE));
      prevVideosRef.current = videos;
    }
  }, [videos]);

  useEffect(() => {
    if (isLoading) return;

    const options = {
      threshold: 0,
      rootMargin: '300px',
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loadingRef.current) {
        loadMore();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observerRef.current = observer;

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget && observerRef.current) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [isLoading, loadMore]);

  const loadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-2">
      {[...Array(6)].map((_, index) => (
        <VideoCard key={index} video={{} as Video} isLoading={true} />
      ))}
    </div>
  ), []);

  const loadingMoreSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-2">
      {[...Array(3)].map((_, index) => (
        <VideoCard key={index} video={{} as Video} isLoading={true} />
      ))}
    </div>
  ), []);

  const videoGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-2 overflow-y-hidden">
      {displayedVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  ), [displayedVideos]);

  if (isLoading) {
    return loadingSkeleton;
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-600">No videos were found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {videoGrid}

      <div ref={observerTargetRef} className="h-20 flex items-center justify-center">
        {isLoadingMore && loadingMoreSkeleton}
        {!isLoadingMore && displayedVideos.length < videos.length && (
          <p className="text-gray-500">Scroll to load more</p>
        )}
        {!isLoadingMore && displayedVideos.length === videos.length && videos.length > 0 && (
          <p className="text-gray-500">No more videos to load</p>
        )}
      </div>
    </div>
  );
}; 