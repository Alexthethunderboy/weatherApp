import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { Suggestion } from '@/lib/api'

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
};

export default function SearchBox(props: Props) {
  return (
    <div className={`relative ${props.className}`}>
      <form onSubmit={props.onSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          value={props.value}
          onChange={props.onChange}
          placeholder="Search location..."
          className="flex-grow"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      {props.suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md mt-1 max-h-60 overflow-auto">
          {props.suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => props.onSuggestionClick(suggestion)}
            >
              {suggestion.name}, {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

