import type { Video } from "@/types/video";

export const matchesSearchTerm = (video: Video, searchTerm: string) => {
    const searchTermLower = searchTerm.toLowerCase();
    return searchTerm === '' ||
      (video.title && video.title.toLowerCase().includes(searchTermLower)) ||
      (video.artist && video.artist.toLowerCase().includes(searchTermLower));
  };
  
  export const matchesYear = (video: Video, year: number | null) => {
    return year === null || video.releaseYear === year;
  };
  
  export const matchesGenres = (video: Video, genres: number[]) => {
    return genres.length === 0 || genres.includes(video.genreId);
  };