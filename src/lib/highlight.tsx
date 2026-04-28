import React from "react";

/**
 * সার্চ কুয়েরির সাথে ম্যাচ হওয়া টেক্সট হাইলাইট করার জন্য ফাংশন
 * এটি প্রজেক্ট নেম বা ভেরিয়েবল কি (Key) এর ভেতরে ম্যাচ হওয়া অংশটুকুকে <mark> ট্যাগ দিয়ে র‍্যাপ করে।
 */
export function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;

  try {
    // কেস-ইনসেনসিটিভ সার্চের জন্য রেজেক্স (Regex) ব্যবহার করা হয়েছে
    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 text-black rounded-sm px-0.5 font-bold dark:bg-yellow-500/50 dark:text-white"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (error) {
    // যদি রেজেক্স এ কোনো স্পেশাল ক্যারেক্টারের জন্য এরর হয়, তবে নরমাল টেক্সট রিটার্ন করবে
    return text;
  }
}
