import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRY_MS = 60 * 60 * 24 * 5 * 1000; // 5 天

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    if (!adminAuth) {
      return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 });
    }

    // 驗證 ID Token 並建立 session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRY_MS / 1000,
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ status: "success" });
}
