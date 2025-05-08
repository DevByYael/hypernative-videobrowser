import type { Video, VideoData } from '../types/video';
import { API_URL } from '../constants/config';

const transformVideo = (video: any): Video => ({
  id: video.id,
  artist: video.artist,
  title: video.title,
  releaseYear: video.release_year,
  genreId: video.genre_id,
  imageUrl: video.image_url,
});

const isValidVideo = (video: any): video is Video => {
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

export async function fetchVideoData(): Promise<VideoData> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch video data');
  }
  
  const jsonData = await response.json();
  
  if (!jsonData.videos || !Array.isArray(jsonData.videos) || !jsonData.genres || !Array.isArray(jsonData.genres)) {
    throw new Error('Invalid data structure received from API');
  }

  const validVideos = jsonData.videos.reduce((acc: Video[], video: Video) => {
    if (isValidVideo(video)) {
      acc.push(transformVideo(video));
    }
    return acc;
  }, []);

  if (validVideos.length !== jsonData.videos.length) {
    console.warn('Some videos were filtered out due to invalid data');
  }

  return {
    videos: validVideos,
    genres: jsonData.genres,
  };
} 