import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useState } from 'react';
import type { Genre } from '../types/video';
import { FilterPopover } from './FilterPopover';
import { Input } from './ui/input';

interface HeaderPanelProps {
  genres: Genre[];
  availableYears: number[];
  onSearchChange: (term: string) => void;
  onYearChange: (year: number | null) => void;
  onGenresChange: (genreIds: number[]) => void;
}

export const HeaderPanel = ({
  genres,
  availableYears,
  onSearchChange,
  onYearChange,
  onGenresChange,
}: HeaderPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [openYear, setOpenYear] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleYearChange = (value: number | null) => {
    setSelectedYear(value);
    onYearChange(value);
    setOpenYear(false);
  };

  const handleGenreChange = (genreId: number) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      onGenresChange(newGenres);
      return newGenres;
    });
  };

  return (
    <div className="flex justify-center flex-col items-center gap-5">
      <div className="text-2xl font-bold">Video Browser</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or artist..."
        />

        <FilterPopover<number, number | null>
          open={openYear}
          onOpenChange={setOpenYear}
          selectedValue={selectedYear}
          options={availableYears}
          onSelect={(value) => {
            if (value === null) {
              handleYearChange(null);
            } else {
              handleYearChange(value);
            }
          }}
          placeholder="Select year..."
          searchPlaceholder="Search year..."
          emptyMessage="No year found."
          showAllOption={true}
          allOptionLabel="All Years"
          allOptionValue={null}
          getOptionValue={(year) => year}
          isOptionSelected={(year, selected) => year === selected}
          renderOption={(year) => (
            <>
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  year === selectedYear ? "opacity-100" : "opacity-0"
                )}
              />
              {year}
            </>
          )}
          renderSelected={(year) => year ? year : "Select year..."}
        />

        <FilterPopover<Genre, number[]>
          open={openGenre}
          onOpenChange={setOpenGenre}
          selectedValue={selectedGenres}
          options={genres}
          onSelect={(genre) => handleGenreChange(genre.id)}
          placeholder="Select genres..."
          searchPlaceholder="Search genres..."
          emptyMessage="No genre found."
          getOptionValue={(genre) => genre.id}
          isOptionSelected={(genre, selected) => selected.includes(genre.id)}
          renderOption={(genre) => (
            <>
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedGenres.includes(genre.id) ? "opacity-100" : "opacity-0"
                )}
              />
              {genre.name}
            </>
          )}
          renderSelected={(selected) => 
            selected.length > 0 ? `${selected.length} selected` : "Select genres..."
          }
        />
      </div>
    </div>
  );
}; 