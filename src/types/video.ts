export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  artist: string;
  title: string;
  releaseYear: number;
  genreId: number;
  imageUrl: string;
}

export interface VideoData {
  genres: Genre[];
  videos: Video[];
}

export interface FilterState {
  searchTerm: string;
  selectedYear: number | null;
  selectedGenres: number[];
} 