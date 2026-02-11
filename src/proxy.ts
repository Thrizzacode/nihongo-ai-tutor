import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化)
     * - favicon.ico (圖標)
     * - 任何帶有副檔名的檔案 (如 .svg, .png)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
