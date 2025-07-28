"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useJournal } from "@/context/JournalContext";
import RichInput from "@/components/journal/RichInput";
import ReflectionPanel from "@/components/journal/ReflectionPanel";
import EntriesSidebar from "@/components/journal/EntriesSidebar";
import { JournalEntry } from "@/types";
import JournalDrawer from "@/components/journal/JournalDrawer";
import { fetchJournals, postJournal } from "@/lib/requests";

export default function JournalPage() {
  const queryClient = useQueryClient();

  const { journal } = useJournal();
  const [entry, setEntry] = useState(journal || "");
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: journalEntriesData,
    isLoading,
    error: jornalError,
  } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: fetchJournals,
  });

  const { mutate: submitJournal, isPending: isSubmitting } = useMutation({
    mutationFn: postJournal,
    onSuccess: (data) => {
      setResponse(data);
      setSubmitted(false);
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["summaryCounts"] });
      queryClient.invalidateQueries({ queryKey: ["allJournalData"] });
    },
    onError: (error) => {
      setError(error.message || "Error during submission.");
      setSubmitted(false);
    },
  });

  const handleSubmit = () => {
    setSubmitted(true);
    setError("");
    setResponse(null);

    if (!entry.trim()) {
      setError("Please make an entry.");
      setSubmitted(false);
      return;
    }

    submitJournal({ entry: entry.trim() });
  };

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
      </div>
    );
  }

  const journalEntries = (journalEntriesData?.journals || []) as JournalEntry[];

  const filteredEntries = journalEntries.filter((entry) =>
    [entry.entry, entry.mood, entry.date].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
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
            <RichInput value={entry} onChange={setEntry} response={response} />
            {(error || jornalError) && (
              <p className="text-red-500 text-sm mt-2">
                {error ||
                  (jornalError instanceof Error ? jornalError.message : "") ||
                  ""}
              </p>
            )}
            {!response && (
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={submitted || isSubmitting || !!response}
              >
                Submit Entry
              </button>
            )}
          </>
          {!error && !jornalError && response && (
            <ReflectionPanel response={response} />
          )}
        </div>

        {isDrawerOpen && selectedEntry && (
          <JournalDrawer
            entry={selectedEntry}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
