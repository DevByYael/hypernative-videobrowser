import { useVideoData } from './hooks/useVideoData';
import { HeaderPanel } from './components/HeaderPanel';
import { VideoList } from './components/VideoList';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const {
    data,
    loading,
    error,
    updateFilters,
    filteredVideos,
    availableYears,
    availableGenres,
  } = useVideoData();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100 py-10">
      <div className="flex w-full items-center gap-4 flex-col">
        <HeaderPanel
          genres={availableGenres}
          availableYears={availableYears}
          onSearchChange={(term) => updateFilters({ searchTerm: term })}
          onYearChange={(year) => updateFilters({ selectedYear: year })}
          onGenresChange={(genres) => updateFilters({ selectedGenres: genres })}
        />
        <VideoList videos={filteredVideos} isLoading={loading} />
      </div>
    </div>
  );
}

export default App;
