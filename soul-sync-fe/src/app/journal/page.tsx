"use client";

import { useEffect, useState } from "react";
import { useJournal } from "@/context/JournalContext";
import AppLayout from "@/components/layouts/AppLayout";
import RichInput from "@/components/journal/RichInput";
import ReflectionPanel from "@/components/journal/ReflectionPanel";
import EntriesSidebar from "@/components/journal/EntriesSidebar";
import { JournalEntry } from "@/types";
import JournalDrawer from "@/components/journal/JournalDrawer";

export default function JournalPage() {
  const { journal } = useJournal();
  const [entry, setEntry] = useState(journal || "");
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSubmit = async () => {
    setSubmitted(true);
    setError("");
    setResponse(null);
    try {
      if (!entry.trim()) {
        setError("Please make an entry.");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journal`,
        {
          method: "POST",
          body: JSON.stringify({
            entry: entry.trim(),
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitted(false);
        return;
      }
      if (data) {
        setResponse(data);
        setSubmitted(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Error during submission. Please try again.");
      setSubmitted(false);
    }
  };

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    async function fetchJournal() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journal`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch journal data");
        }
        const data = await res.json();
        setJournalEntries(data.journals);
      } catch (error) {
        console.error("Error loading journal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJournal();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredEntries = journalEntries.filter((entry) =>
    [entry.entry, entry.mood, entry.date].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col justify-center lg:flex-row gap-6 h-full p-4">
          {/* Sidebar */}
          <div className="lg:w-2/5 w-full">
            <EntriesSidebar
              journalEntries={filteredEntries}
              onSearch={setSearchTerm}
              onEntryClick={handleEntryClick}
            />
          </div>

          {/* Main Area */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold text-purple-700">
              Your Journal
            </h1>
            <blockquote className="text-gray-500 italic mt-2">
              The purpose of Jounaling is have a safe space to vent, express, or
              reflect deeply - no structure, just open journaling
            </blockquote>

            <>
              <RichInput
                value={entry}
                onChange={setEntry}
                response={response}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {!response && (
                <button
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={submitted || !!response}
                >
                  Submit Entry
                </button>
              )}
            </>
            {!error && response && <ReflectionPanel response={response} />}
          </div>

          {isDrawerOpen && selectedEntry && (
            <JournalDrawer
              entry={selectedEntry}
              onClose={() => setIsDrawerOpen(false)}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
