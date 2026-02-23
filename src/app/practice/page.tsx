import Navbar from "@/components/layout/Navbar";
import ChatArea from "@/components/chat/ChatArea";

export default function PracticePage() {
  return (
    <div className="flex h-screen flex-col bg-background font-[var(--font-jp)] antialiased overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[72px] overflow-hidden">
        <ChatArea />
      </main>
    </div>
  );
}
