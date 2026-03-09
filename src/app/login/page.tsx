"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      router.push("/practice");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗，請檢查帳號密碼");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push("/practice");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google 登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-sm shadow-black/5">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            <Link href="/">Nihongo AI Tutor</Link>
          </CardTitle>
          <CardDescription>歡迎回來，今天也要一起練習日文嗎？</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}

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
              className="w-full bg-primary hover:bg-primary/90 text-white"
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
              <span className="bg-background px-2 text-muted-foreground">或透過以下方式</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-200"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            使用 Google 帳號登入
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
          還沒有帳號嗎？{" "}
          <a href="/signup" className="text-primary hover:underline">
            立即註冊
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
