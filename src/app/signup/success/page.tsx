import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">註冊成功！🎉</h1>
          <p className="text-muted-foreground">帳號已建立完成，您現在可以開始使用所有功能。</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white px-8">
          <Link href="/practice">開始練習日語</Link>
        </Button>
      </div>
    </div>
  );
}
