import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TopNavigation } from "./top-navigation";
import { LogOut } from "lucide-react";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(2); // Example count for UI display
  const { user, logoutMutation } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative z-10 flex flex-col flex-shrink-0">
      <TopNavigation 
        activeFilters={activeFilters}
        onFilterClick={() => console.log("Filter clicked")}
        onMenuClick={() => setShowSidebar(!showSidebar)}
      />
      
      {/* User profile dropdown */}
      <div className="absolute top-3 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center">
            <Avatar className="h-8 w-8 bg-[hsl(160,100%,10%)] text-white">
              <AvatarFallback>
                {user?.fullName?.split(' ')
                  .map(name => name[0])
                  .join('')
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-500">{user?.hospital || 'No hospital'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => logoutMutation.mutate()}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
