"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, History, Settings, CreditCard } from "lucide-react";

export default function UserNavMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!user) return null;

  // 使用 email "@" 前面的字串當作顯示名稱，或是用首字母
  const emailNamePart = user.email?.split("@")[0] || "User";
  const initial = emailNamePart.charAt(0).toUpperCase();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-matsu-light text-matsu hover:bg-matsu/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="User menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Avatar className="h-10 w-10">
            {/* 假如之後 user 有頭像 URL 可以放這 */}
            <AvatarImage src={user.photoURL || ""} alt={emailNamePart} />
            <AvatarFallback className="bg-sakura-light text-primary font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 z-[300]"
        align="end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{emailNamePart}</p>
            <p className="text-xs leading-none text-text-muted">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <History className="mr-2 h-4 w-4" />
          <span>學習紀錄</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <Settings className="mr-2 h-4 w-4" />
          <span>帳號設定</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>方案訂閱</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
