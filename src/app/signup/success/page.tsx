import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">註冊成功！🎉</h1>
          <p className="text-muted-foreground">
            帳號已建立成功，現在您可以直接返回登入頁面開始使用。
            {/* 暫時關閉驗證信：請至您的 Email 信箱查收驗證信，點擊連結後即可完成帳號啟用。 */}
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white px-8"
        >
          <Link href="/login">返回登入</Link>
        </Button>
      </div>
    </div>
  );
}
