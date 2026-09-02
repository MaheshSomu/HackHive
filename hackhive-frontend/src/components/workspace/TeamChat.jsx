import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    AlertTriangle,
    ArrowDown,
    Calendar,
    CheckCheck,
    MessageSquare,
    RefreshCw,
    Send,
    Users,
    Wifi,
    WifiOff,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { workspaceService } from "../../services/workspaceService";
import { storage } from "../../utils/storage";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

function parseStompFrame(text) {
    if (!text) return null;
    const nullIdx = text.indexOf("\0");
    const clean = nullIdx >= 0 ? text.slice(0, nullIdx) : text;
    const lines = clean.split("\n");
    const command = lines[0].trim();
    const headers = {};
    let i = 1;
    for (; i < lines.length; i++) {
        const line = lines[i];
        if (line === "" || line === "\r") {
            i++;
            break;
        }
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
            const k = line.slice(0, colonIdx).trim();
            const v = line.slice(colonIdx + 1).trim();
            headers[k] = v;
        }
    }
    const body = lines.slice(i).join("\n");
    return { command, headers, body };
}

function createStompFrame(command, headers = {}, body = "") {
    let str = command + "\n";
    for (const [k, v] of Object.entries(headers)) {
        str += `${k}:${v}\n`;
    }
    str += "\n" + body + "\0";
    return str;
}

function formatTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function formatDateSeparator(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";

    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

export default function TeamChat({ team, members = [] }) {
    const { user: authUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [unreadNotice, setUnreadNotice] = useState(false);

    // Connection State: 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED' | 'AUTH_ERROR'
    const [connectionState, setConnectionState] = useState("CONNECTING");

    const scrollContainerRef = useRef(null);
    const isNearBottomRef = useRef(true);

    const activeSocketRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const heartbeatTimerRef = useRef(null);
    const connectionStateRef = useRef("CONNECTING");
    const authToastShownRef = useRef(false);
    const reconnectToastShownRef = useRef(false);

    const updateConnectionState = (newState) => {
        connectionStateRef.current = newState;
        setConnectionState(newState);
    };

    const checkIsNearBottom = () => {
        const el = scrollContainerRef.current;
        if (!el) return true;
        const threshold = 100;
        return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    };

    const handleScroll = () => {
        const nearBottom = checkIsNearBottom();
        isNearBottomRef.current = nearBottom;
        if (nearBottom && unreadNotice) {
            setUnreadNotice(false);
        }
    };

    const scrollToBottom = (smooth = true) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
        });
        setUnreadNotice(false);
    };

    // Load Chat History
    const loadHistory = useCallback(async () => {
        if (!team?.id) return;
        try {
            const history = await workspaceService.getTeamChatHistory(team.id);
            const list = Array.isArray(history) ? history : [];

            setMessages((prev) => {
                if (prev.length > 0 && list.length > prev.length && !isNearBottomRef.current) {
                    setUnreadNotice(true);
                }
                return list;
            });

            if (isNearBottomRef.current) {
                setTimeout(() => scrollToBottom(false), 50);
            }
        } catch {
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [team?.id]);

    useEffect(() => {
        loadHistory();
        const interval = setInterval(loadHistory, 4000);
        return () => clearInterval(interval);
    }, [loadHistory]);

    const getWebSocketUrl = useCallback(() => {
        if (import.meta.env.VITE_WS_URL) {
            return import.meta.env.VITE_WS_URL;
        }
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
        if (apiBase.startsWith("http")) {
            try {
                const url = new URL(apiBase);
                const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
                return `${wsProtocol}//${url.host}/ws`;
            } catch {
                // fallback
            }
        }
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        return `${wsProtocol}//${window.location.host}/ws`;
    }, []);

    // WebSocket STOMP Connection Lifecycle
    useEffect(() => {
        if (!team?.id) return;

        let isCleanedUp = false;
        authToastShownRef.current = false;
        reconnectToastShownRef.current = false;

        const clearTimers = () => {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
                heartbeatTimerRef.current = null;
            }
        };

        const connectWebSocket = () => {
            if (isCleanedUp) return;

            const token = storage.getToken();
            if (!token) {
                updateConnectionState("AUTH_ERROR");
                if (!authToastShownRef.current) {
                    authToastShownRef.current = true;
                    toast.error("Your session has expired. Please log in again.");
                }
                return;
            }

            // Capture and cleanly disown any existing socket instance
            if (activeSocketRef.current) {
                const oldWs = activeSocketRef.current;
                activeSocketRef.current = null;
                oldWs.onopen = null;
                oldWs.onmessage = null;
                oldWs.onclose = null;
                oldWs.onerror = null;
                try {
                    oldWs.close();
                } catch {
                    // ignore
                }
            }

            const wsUrl = getWebSocketUrl();

            try {
                if (connectionStateRef.current !== "CONNECTED") {
                    updateConnectionState(reconnectToastShownRef.current ? "RECONNECTING" : "CONNECTING");
                }

                const ws = new WebSocket(wsUrl);
                activeSocketRef.current = ws;

                ws.onopen = () => {
                    if (isCleanedUp || activeSocketRef.current !== ws) {
                        try {
                            ws.close();
                        } catch {
                            // ignore
                        }
                        return;
                    }
                    ws.send(
                        createStompFrame("CONNECT", {
                            "accept-version": "1.1,1.0",
                            "heart-beat": "0,0",
                            Authorization: `Bearer ${token}`,
                        })
                    );
                };

                ws.onmessage = (event) => {
                    if (isCleanedUp || activeSocketRef.current !== ws) return;
                    const frame = parseStompFrame(event.data);
                    if (!frame) return;

                    if (frame.command === "CONNECTED") {
                        clearTimers();
                        reconnectToastShownRef.current = false;
                        updateConnectionState("CONNECTED");

                        // Periodic client ping interval to keep intermediate proxies alive
                        heartbeatTimerRef.current = setInterval(() => {
                            if (activeSocketRef.current === ws && ws.readyState === WebSocket.OPEN) {
                                ws.send("\n");
                            }
                        }, 15000);

                        ws.send(
                            createStompFrame("SUBSCRIBE", {
                                id: `sub-${team.id}`,
                                destination: `/topic/teams/${team.id}/chat`,
                            })
                        );
                    } else if (frame.command === "MESSAGE") {
                        try {
                            const newMsg = JSON.parse(frame.body);
                            if (newMsg && newMsg.id) {
                                setMessages((prev) => {
                                    if (prev.some((m) => m.id === newMsg.id)) return prev;
                                    if (!isNearBottomRef.current) setUnreadNotice(true);
                                    return [...prev, newMsg];
                                });
                                if (isNearBottomRef.current) {
                                    setTimeout(() => scrollToBottom(true), 50);
                                }
                            }
                        } catch {
                            // ignore malformed body
                        }
                    } else if (frame.command === "ERROR") {
                        clearTimers();
                        const errorMsg = (frame.headers?.message || frame.body || "").toLowerCase();
                        if (
                            errorMsg.includes("expired") ||
                            errorMsg.includes("invalid") ||
                            errorMsg.includes("token") ||
                            errorMsg.includes("authorization") ||
                            errorMsg.includes("disabled") ||
                            errorMsg.includes("user not found") ||
                            errorMsg.includes("not authorized")
                        ) {
                            updateConnectionState("AUTH_ERROR");
                            if (!authToastShownRef.current) {
                                authToastShownRef.current = true;
                                toast.error("Access to team chat was denied.");
                            }
                            ws.close();
                        } else {
                            updateConnectionState("DISCONNECTED");
                            ws.close();
                        }
                    }
                };

                ws.onclose = (event) => {
                    clearTimers();
                    if (isCleanedUp || activeSocketRef.current !== ws || connectionStateRef.current === "AUTH_ERROR") {
                        return;
                    }

                    // If server explicitly closes with 1002 protocol error (subscription rejection), do not endless retry
                    if (event.code === 1002) {
                        updateConnectionState("AUTH_ERROR");
                        if (!authToastShownRef.current) {
                            authToastShownRef.current = true;
                            toast.error("Subscription to team chat was denied.");
                        }
                        return;
                    }

                    updateConnectionState("RECONNECTING");
                    if (!reconnectToastShownRef.current) {
                        reconnectToastShownRef.current = true;
                    }

                    reconnectTimerRef.current = setTimeout(() => {
                        if (!isCleanedUp && activeSocketRef.current === ws) {
                            connectWebSocket();
                        }
                    }, 5000);
                };

                ws.onerror = () => {
                    // Handled natively via onclose
                };
            } catch {
                clearTimers();
                if (!isCleanedUp && activeSocketRef.current === ws) {
                    updateConnectionState("DISCONNECTED");
                }
            }
        };

        connectWebSocket();

        return () => {
            isCleanedUp = true;
            clearTimers();
            if (activeSocketRef.current) {
                const oldWs = activeSocketRef.current;
                activeSocketRef.current = null;
                oldWs.onopen = null;
                oldWs.onmessage = null;
                oldWs.onclose = null;
                oldWs.onerror = null;
                try {
                    oldWs.close();
                } catch {
                    // ignore
                }
            }
            updateConnectionState("DISCONNECTED");
        };
    }, [team?.id, getWebSocketUrl]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!content.trim() || !team?.id || sending) return;

        const text = content.trim();
        setContent("");

        try {
            setSending(true);
            const payload = {
                teamId: team.id,
                content: text,
            };

            const sentMsg = await workspaceService.sendChatMessage(payload);
            setMessages((prev) => [...prev, sentMsg]);
            isNearBottomRef.current = true;
            setTimeout(() => scrollToBottom(true), 50);
        } catch {
            toast.error("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Grouping helper: group messages from same sender within 5 mins
    const groupedMessages = useMemo(() => {
        const result = [];
        let currentDateLabel = "";

        messages.forEach((msg, index) => {
            const dateLabel = formatDateSeparator(msg.sentAt);
            if (dateLabel !== currentDateLabel) {
                currentDateLabel = dateLabel;
                result.push({ type: "date_separator", label: dateLabel, id: `sep-${index}` });
            }

            const prevMsg = messages[index - 1];
            const sameSender =
                prevMsg &&
                prevMsg.senderName === msg.senderName &&
                msg.sentAt &&
                prevMsg.sentAt &&
                new Date(msg.sentAt) - new Date(prevMsg.sentAt) < 300000;

            result.push({
                type: "message",
                data: msg,
                isGrouped: sameSender,
            });
        });

        return result;
    }, [messages]);

    return (
        <Card className="relative flex h-[600px] flex-col overflow-hidden border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/40 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <MessageSquare className="size-4.5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                #{team?.name || "team-chat"}
                            </h3>
                            {connectionState === "CONNECTED" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                    <Wifi className="size-3" /> Live Channel
                                </span>
                            ) : connectionState === "RECONNECTING" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                                    <RefreshCw className="size-3 animate-spin" /> Reconnecting...
                                </span>
                            ) : connectionState === "CONNECTING" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                                    <RefreshCw className="size-3 animate-spin" /> Connecting...
                                </span>
                            ) : connectionState === "AUTH_ERROR" ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-400">
                                    <AlertTriangle className="size-3" /> Access Denied
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    <WifiOff className="size-3" /> Disconnected
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                            {team?.eventTitle || "Hackathon"} • {members.length} members
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={loadHistory}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800"
                        title="Refresh chat history"
                    >
                        <RefreshCw className="size-3.5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Messages Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 space-y-3 relative scroll-smooth"
            >
                {loading ? (
                    <div className="space-y-4 p-4">
                        <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                        <div className="ml-auto h-10 w-1/2 animate-pulse rounded-2xl bg-indigo-100 dark:bg-indigo-950" />
                        <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    </div>
                ) : groupedMessages.length > 0 ? (
                    groupedMessages.map((item) => {
                        if (item.type === "date_separator") {
                            return (
                                <div key={item.id} className="my-4 flex items-center justify-center">
                                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        const msg = item.data;
                        const isMe =
                            msg.senderName === authUser?.fullName ||
                            msg.senderName === authUser?.email?.split("@")[0];

                        const initials = (msg.senderName || "U")[0].toUpperCase();

                        return (
                            <motion.div
                                key={msg.id || item.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} ${item.isGrouped ? "mt-1" : "mt-3"
                                    }`}
                            >
                                {!item.isGrouped ? (
                                    <div
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full font-extrabold text-[10px] ${isMe
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-900 text-white dark:bg-indigo-600"
                                            }`}
                                    >
                                        {initials}
                                    </div>
                                ) : (
                                    <div className="size-7 shrink-0" />
                                )}

                                <div className={`max-w-md space-y-0.5 ${isMe ? "items-end text-right" : "items-start"}`}>
                                    {!item.isGrouped && (
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {msg.senderName || "Teammate"}
                                            </span>
                                            <span>•</span>
                                            <span>{formatTime(msg.sentAt)}</span>
                                        </div>
                                    )}

                                    <div
                                        className={`inline-block rounded-2xl px-3.5 py-2 text-xs leading-5 shadow-2xs ${isMe
                                                ? "bg-indigo-600 text-white font-medium"
                                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center space-y-2 text-slate-400 p-8">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            <MessageSquare className="size-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No messages in team channel yet</p>
                        <p className="text-[11px] text-slate-400 max-w-xs">
                            Start the team discussion for your hackathon project using the composer below.
                        </p>
                    </div>
                )}
            </div>

            {/* New Messages Pill Notification */}
            <AnimatePresence>
                {unreadNotice && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
                    >
                        <button
                            type="button"
                            onClick={() => scrollToBottom(true)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg transition hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                            New Messages <ArrowDown className="size-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Bottom Composer */}
            <form onSubmit={handleSend} className="sticky bottom-0 z-10 border-t border-slate-200 bg-slate-50/90 p-3.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90">
                <div className="flex items-end gap-2.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                    <textarea
                        rows={1}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message #${team?.name || "channel"} (Enter to send, Shift+Enter for line break)...`}
                        className="max-h-24 min-h-[38px] flex-1 resize-none bg-transparent p-2 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    />

                    <Button
                        type="submit"
                        disabled={!content.trim() || sending}
                        size="sm"
                        className="bg-indigo-600 text-white font-bold px-4 h-9 rounded-xl shrink-0"
                    >
                        {sending ? "Sending..." : <Send className="size-4" />}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
