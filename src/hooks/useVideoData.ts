import { useEffect, useMemo, useState } from 'react';
import { fetchVideoData } from '../services/videoService';
import type { FilterState, VideoData } from '../types/video';

export const useVideoData = () => {
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedYear: null,
    selectedGenres: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const videoData = await fetchVideoData();
        setData(videoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredVideos = useMemo(() => {
    if (!data) return [];

    setLoading(true);

    const filteredVideos = data.videos.filter((video) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch = filters.searchTerm === '' ||
        (video.title && video.title.toLowerCase().includes(searchTermLower)) ||
        (video.artist && video.artist.toLowerCase().includes(searchTermLower));

      const matchesYear = filters.selectedYear === null ||
        video.releaseYear === filters.selectedYear;

      const matchesGenre = filters.selectedGenres.length === 0 ||
        filters.selectedGenres.includes(video.genreId);

      return matchesSearch && matchesYear && matchesGenre;
    });

    setLoading(false);

    return filteredVideos;
  }, [data, filters]);

  const availableYears = useMemo(() => {
    if (!data) return [];
    
    const filteredBySearchAndGenre = data.videos.filter(video => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch = filters.searchTerm === '' ||
        (video.title && video.title.toLowerCase().includes(searchTermLower)) ||
        (video.artist && video.artist.toLowerCase().includes(searchTermLower));

      const matchesGenre = filters.selectedGenres.length === 0 ||
        filters.selectedGenres.includes(video.genreId);

      return matchesSearch && matchesGenre;
    });

    return [...new Set(filteredBySearchAndGenre.map(video => video.releaseYear))]
      .sort((a, b) => b - a);
  }, [data, filters.searchTerm, filters.selectedGenres]);

  const availableGenres = useMemo(() => {
    if (!data) return [];
    
    const filteredBySearchAndYear = data.videos.filter(video => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const matchesSearch = filters.searchTerm === '' ||
        (video.title && video.title.toLowerCase().includes(searchTermLower)) ||
        (video.artist && video.artist.toLowerCase().includes(searchTermLower));

      const matchesYear = filters.selectedYear === null ||
        video.releaseYear === filters.selectedYear;

      return matchesSearch && matchesYear;
    });

    const availableGenreIds = new Set(filteredBySearchAndYear.map(video => video.genreId));
    
    return data.genres.filter(genre => availableGenreIds.has(genre.id));
  }, [data, filters.searchTerm, filters.selectedYear]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    filteredVideos,
    availableYears,
    availableGenres,
  };
}; 