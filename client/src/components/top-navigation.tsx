import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  Search, 
  Filter, 
  Bell, 
  HelpCircle, 
  UserCircle 
} from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "./ui/badge";

interface TopNavigationProps {
  activeFilters?: number;
  onFilterClick?: () => void;
  onMenuClick?: () => void;
}

export function TopNavigation({ 
  activeFilters = 0, 
  onFilterClick, 
  onMenuClick 
}: TopNavigationProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
      {/* Left section - Menu (mobile only) and Search */}
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        
        <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-2">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-500 text-sm">search</span>
        </div>
      </div>
      
      {/* Center section - Filter */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onFilterClick} 
          className="flex items-center gap-2 px-4"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filter</span>
          {activeFilters > 0 && (
            <Badge className="ml-1 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center p-0">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Right section - Notifications, Help, Profile */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Help</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <UserCircle className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </div>
  );
}