"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "resume-builder-form-data";

type CloudSnapshot = {
  resume: Record<string, unknown> | null;
  updatedAt: string | null;
};

type AccessState = "checking" | "logged-out" | "logged-in";

export default function PrivateBackupPage() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [password, setPassword] = useState("");
  const [snapshot, setSnapshot] = useState<CloudSnapshot>({
    resume: null,
    updatedAt: null,
  });
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const refreshSnapshot = useCallback(async () => {
    const response = await fetch("/api/private/resume", {
      cache: "no-store",
    });

    if (response.status === 401) {
      setAccessState("logged-out");
      setSnapshot({ resume: null, updatedAt: null });
      return;
    }

    const data = (await response.json()) as CloudSnapshot & { error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Unable to access the private backup.");
    }

    setSnapshot({ resume: data.resume, updatedAt: data.updatedAt });
    setAccessState("logged-in");
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshSnapshot().catch((error) => {
        setAccessState("logged-out");
        setMessage(error instanceof Error ? error.message : "Unable to connect.");
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshSnapshot]);

  async function logIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsWorking(true);
    setMessage("");

    try {
      const response = await fetch("/api/private/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setPassword("");
      await refreshSnapshot();
      setMessage("Private access unlocked.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsWorking(false);
    }
  }

  async function logOut() {
    setIsWorking(true);
    setMessage("");

    try {
      await fetch("/api/private/logout", { method: "POST" });
      setAccessState("logged-out");
      setSnapshot({ resume: null, updatedAt: null });
      setMessage("Signed out.");
    } finally {
      setIsWorking(false);
    }
  }

  async function saveCurrentDraft() {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (!savedDraft) {
      setMessage("This browser does not have a resume draft to save.");
      return;
    }

    if (
      snapshot.resume &&
      !window.confirm("Replace the existing cloud backup with this browser's draft?")
    ) {
      return;
    }

    setIsWorking(true);
    setMessage("");

    try {
      const resume = JSON.parse(savedDraft) as Record<string, unknown>;
      const response = await fetch("/api/private/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });

      const data = (await response.json()) as {
        error?: string;
        updatedAt?: string;
      };

      if (!response.ok) {
        if (response.status === 401) setAccessState("logged-out");
        throw new Error(data.error || "Cloud save failed.");
      }

      setSnapshot({ resume, updatedAt: data.updatedAt || new Date().toISOString() });
      setMessage("Current browser draft saved to the cloud.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cloud save failed.");
    } finally {
      setIsWorking(false);
    }
  }

  function loadCloudDraft() {
    if (!snapshot.resume) {
      setMessage("No cloud backup is available yet.");
      return;
    }

    const localDraft = localStorage.getItem(STORAGE_KEY);

    if (
      localDraft &&
      !window.confirm("Replace this browser's current draft with the cloud backup?")
    ) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.resume));
    window.location.assign("/");
  }

  return (
    <main className="min-h-dvh bg-gray-400 p-4 sm:p-8 text-gray-800">
      <section className="mx-auto max-w-2xl rounded-2xl bg-gray-100 p-6 sm:p-8 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-300 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              EasyCV
            </p>
            <h1 className="mt-1 text-3xl font-bold">Private Resume Backup</h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Save the draft from this browser to your private cloud backup, or
              restore the latest cloud copy on a different device.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Back to editor
          </Link>
        </div>

        {accessState === "checking" && (
          <p className="py-12 text-center text-gray-500">Checking private access...</p>
        )}

        {accessState === "logged-out" && (
          <form onSubmit={logIn} className="mt-8 space-y-5">
            <div>
              <label htmlFor="private-password" className="block font-medium">
                Private password
              </label>
              <input
                id="private-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isWorking}
              className="rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800 disabled:bg-gray-500"
            >
              {isWorking ? "Signing in..." : "Unlock private backup"}
            </button>
          </form>
        )}

        {accessState === "logged-in" && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-gray-300 bg-white p-5">
              <p className="font-semibold">Cloud backup status</p>
              <p className="mt-1 text-sm text-gray-600">
                {snapshot.updatedAt
                  ? `Last saved: ${new Date(snapshot.updatedAt).toLocaleString()}`
                  : "No cloud backup has been saved yet."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={saveCurrentDraft}
                disabled={isWorking}
                className="rounded-xl bg-black p-5 text-left text-white hover:bg-gray-800 disabled:bg-gray-500"
              >
                <span className="block text-lg font-semibold">Save to cloud</span>
                <span className="mt-1 block text-sm text-gray-300">
                  Upload the resume currently saved in this browser.
                </span>
              </button>

              <button
                type="button"
                onClick={loadCloudDraft}
                disabled={isWorking || !snapshot.resume}
                className="rounded-xl bg-blue-600 p-5 text-left text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                <span className="block text-lg font-semibold">Load into editor</span>
                <span className="mt-1 block text-sm text-blue-100">
                  Replace this browser&apos;s draft and open the resume editor.
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={logOut}
              disabled={isWorking}
              className="text-sm font-medium text-gray-600 underline hover:text-black"
            >
              Sign out of private backup
            </button>
          </div>
        )}

        {message && (
          <p
            role="status"
            className="mt-6 rounded-lg border border-gray-300 bg-white p-3 text-sm"
          >
            {message}
          </p>
        )}

        <p className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500">
          The private password and database credentials are stored only in Railway
          server variables. They are never included in the browser bundle.
        </p>
      </section>
    </main>
  );
}
