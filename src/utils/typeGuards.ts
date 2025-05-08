import type { Video } from '../types/video';

export const isValidVideo = (video: any): video is Video => {
  return (
    typeof video === 'object' &&
    video !== null &&
    typeof video.id === 'number' &&
    typeof video.title === 'string' &&
    typeof video.artist === 'string' &&
    typeof video.release_year === 'number' &&
    typeof video.genre_id === 'number' &&
    typeof video.image_url === 'string'
  );
}; 