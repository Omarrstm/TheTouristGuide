"use client";

import { useState } from "react";
import { addPlaceToItinerary, createItinerary, removePlaceFromItinerary } from "@/app/trips/actions";

type Trip = { id: string; name: string; hasPlace: boolean };

export default function AddToTripButton({
  placeId,
  trips: initialTrips,
}: {
  placeId: string;
  trips: Trip[];
}) {
  const [trips, setTrips] = useState(initialTrips);
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [creatingPending, setCreatingPending] = useState(false);

  async function handleToggle(trip: Trip) {
    setError(null);
    setPending((p) => new Set(p).add(trip.id));
    try {
      if (trip.hasPlace) {
        await removePlaceFromItinerary({ itineraryId: trip.id, placeId });
      } else {
        await addPlaceToItinerary({ itineraryId: trip.id, placeId });
      }
      setTrips((ts) => ts.map((t) => (t.id === trip.id ? { ...t, hasPlace: !t.hasPlace } : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update this trip.");
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(trip.id);
        return next;
      });
    }
  }

  async function handleCreateAndAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreatingPending(true);
    try {
      const { id } = await createItinerary({ name: newName });
      await addPlaceToItinerary({ itineraryId: id, placeId });
      setTrips((ts) => [{ id, name: newName.trim(), hasPlace: true }, ...ts]);
      setNewName("");
      setCreating(false);
      setFocused(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't create this trip.");
    } finally {
      setCreatingPending(false);
    }
  }

  const open = focused || creating;

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        className="rounded-full border border-border bg-surface-2 px-4 py-2 text-[12px] font-bold tracking-wide text-text uppercase hover:border-accent hover:text-accent"
      >
        Add to Trip
      </button>

      {open && (
        <div className="card-shine absolute top-full z-10 mt-2 w-64 overflow-hidden rounded-lg">
          {trips.length === 0 && !creating && (
            <p className="px-3 py-2.5 text-[12.5px] text-muted">You don&rsquo;t have any trips yet.</p>
          )}
          {trips.map((trip) => (
            <button
              key={trip.id}
              type="button"
              onMouseDown={() => handleToggle(trip)}
              disabled={pending.has(trip.id)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13.5px] text-text hover:bg-surface-2 disabled:opacity-50"
            >
              <span className="w-4 text-accent">{trip.hasPlace ? "✓" : ""}</span>
              {trip.name}
            </button>
          ))}

          <div className="border-t border-border">
            {creating ? (
              <form onSubmit={handleCreateAndAdd} className="flex flex-col gap-2 p-2.5">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  placeholder="Trip name"
                  className="w-full rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-[13px] text-text outline-none focus-visible:border-accent"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={creatingPending}
                    className="btn-primary shrink-0 rounded-[4px] px-2.5 py-1.5 text-[11px]"
                  >
                    {creatingPending ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(false);
                      setNewName("");
                    }}
                    className="text-[12px] font-semibold text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onMouseDown={() => setCreating(true)}
                className="w-full px-3 py-2.5 text-left text-[13.5px] font-semibold text-accent hover:bg-surface-2"
              >
                + New trip
              </button>
            )}
          </div>

          {error && <p className="px-3 py-2 text-[12px] text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
