"use client";

import { useState } from "react";
import Link from "next/link";
import { markAllNotificationsRead, markNotificationRead } from "@/app/notifications/actions";

export type NotificationData = {
  id: string;
  title: string;
  body: string | null;
  href: string;
  createdAt: string;
  readAt: string | null;
};

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell({
  notifications: initialNotifications,
}: {
  notifications: NotificationData[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [focused, setFocused] = useState(false);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  function handleClickNotification(id: string) {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
    markNotificationRead(id).catch(() => {});
  }

  function handleMarkAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    markAllNotificationsRead().catch(() => {});
  }

  return (
    <div className="relative">
      <button
        type="button"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        className="relative text-[13px] font-semibold tracking-wide text-muted hover:text-accent"
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-bg">
            {unreadCount}
          </span>
        )}
      </button>

      {focused && (
        <div className="card-shine absolute top-full z-10 mt-2 w-72 overflow-hidden rounded-lg">
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                Notifications
              </span>
              <button
                type="button"
                onMouseDown={handleMarkAllRead}
                className="text-[11px] font-semibold text-accent hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <p className="px-3 py-2.5 text-[12.5px] text-muted">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                onMouseDown={() => handleClickNotification(n.id)}
                className={`block px-3 py-2.5 text-left hover:bg-surface-2 ${
                  n.readAt ? "" : "bg-accent-soft"
                }`}
              >
                <p className="text-[13px] font-semibold text-text">{n.title}</p>
                {n.body && <p className="mt-0.5 text-[12px] text-muted">{n.body}</p>}
                <p className="mt-1 text-[11px] text-muted">{timeAgo(n.createdAt)}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
