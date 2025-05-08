import type { Video } from '../types/video';
import { Skeleton } from './ui/skeleton';

interface VideoCardProps {
  video: Video;
  isLoading?: boolean;
}

export const VideoCard = ({ video, isLoading = false }: VideoCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <Skeleton className="w-full aspect-video" />
        </div>
        <div className="p-1 flex flex-col gap-2 items-center bg-orange-50">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <img
          src={video.imageUrl}
          alt={`${video.title} by ${video.artist}`}
          className="object-contain"
        />
      </div>
      <div className="p-1 flex flex-col gap-1 items-center bg-orange-50">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{video.title}</h3>
        <p className="text-sm text-gray-600">{video.artist}</p>
        <p className="text-sm text-gray-500">{video.releaseYear}</p>
      </div>
    </div>
  );
}; 