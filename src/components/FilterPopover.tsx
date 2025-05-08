import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface FilterPopoverProps<T, V> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedValue: V;
  options: T[];
  onSelect: (value: T) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  renderOption: (option: T) => React.ReactNode;
  renderSelected: (selected: V) => React.ReactNode;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionValue?: T | null;
  getOptionValue: (option: T) => string | number;
  isOptionSelected: (option: T, selected: V) => boolean;
}

export function FilterPopover<T, V>({
  open,
  onOpenChange,
  selectedValue,
  options,
  onSelect,
  searchPlaceholder,
  emptyMessage,
  renderOption,
  renderSelected,
  showAllOption,
  allOptionLabel,
  allOptionValue,
  getOptionValue,
  isOptionSelected,
}: FilterPopoverProps<T, V>) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {renderSelected(selectedValue)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-96 overflow-y-auto">
            {showAllOption && allOptionValue !== undefined && (
              <CommandItem
                value="all"
                onSelect={() => onSelect(allOptionValue)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isOptionSelected(allOptionValue, selectedValue) ? "opacity-100" : "opacity-0"
                  )}
                />
                {allOptionLabel}
              </CommandItem>
            )}
            {options.map((option) => (
              <CommandItem
                key={getOptionValue(option).toString()}
                value={getOptionValue(option).toString()}
                onSelect={() => onSelect(option)}
              >
                {renderOption(option)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 