"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // 1. Email/Password 登入
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else window.location.href = "/dashboard"; // 登入成功跳轉
    setLoading(false);
  };

  // 2. Google 第三方登入
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] p-4">
      <Card className="w-full max-w-md border-none shadow-sm shadow-black/5">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#2D2926]">
            Nihongo AI Tutor
          </CardTitle>
          <CardDescription>歡迎回來，今天也要一起練習日文嗎？</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email 地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D05D6E] hover:bg-[#D05D6E]/90 text-white"
              disabled={loading}
            >
              {loading ? "登入中..." : "帳密登入"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                或透過以下方式
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-200"
            onClick={handleGoogleLogin}
          >
            使用 Google 帳號登入
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
          還沒有帳號嗎？{" "}
          <a href="/signup" className="text-[#D05D6E] hover:underline">
            立即註冊
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
