import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export default function SearchBox(props: Props) {
  return (
    <form onSubmit={props.onSubmit} className={`flex items-center space-x-2 ${props.className}`}>
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
  )
}

