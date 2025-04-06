import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

export interface UserListProps {
  users: User[];
  currentUserId: string;
  onSelectUser?: (userId: string) => void;
  selectedUserId?: string;
}

export function UserList({ users, currentUserId, onSelectUser, selectedUserId }: UserListProps) {
  return (
    <div className="w-full h-full border-r bg-secondary/30">
      <div className="p-4 border-b">
        <h2 className="font-medium text-lg">参加者</h2>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-2">
          {users.map((user) => (
            <button
              key={user.id}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                selectedUserId === user.id 
                  ? 'bg-primary/10' 
                  : 'hover:bg-secondary/80'
              }`}
              onClick={() => onSelectUser?.(user.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={user.id === currentUserId ? "bg-blueberry-accent text-white" : "bg-primary text-white"}>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center">
                  <span className="font-medium">
                    {user.name}
                    {user.id === currentUserId && " (あなた)"}
                  </span>
                </div>
              </div>
              {user.isOnline && (
                <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30 px-2 py-0 h-5">
                  オンライン
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
