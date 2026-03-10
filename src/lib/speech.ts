/**
 * Synthesizes Japanese speech using the browser's native Web Speech API.
 *
 * @param text The Japanese text (Kanji, Kana) to speak.
 * @param rate The playback rate, default is 1.0.
 */
export function speak(text: string, rate: number = 1.0): void {
  // Playback Safety: Verify environment supports SpeechSynthesis and we are on the client-side
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

  try {
    // Inject trailing punctuation for short texts to improve natural decay (especially for Kana cards)
    const processedText = text.length <= 2 ? `${text}ー` : text;
    const utterance = new SpeechSynthesisUtterance(processedText);

    // Lock language to Japanese
    utterance.lang = "ja-JP";

    // Set learner-friendly speech rate
    utterance.rate = rate;

    // Optional: Cancel any currently playing speech to ensure immediate feedback for clicks
    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    // Fail silently without breaking the application
    console.warn("SpeechSynthesis error:", error);
  }
}
