import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ChatMessage, ChatThread, MessageKind, MorningBrief } from '@/types/models';
import {
  OWNER_ID,
  directThreadId,
  seedBriefs,
  seedMessages,
  seedThreads,
} from '@/data/seed';
import { seedMembers } from '@/data/seed';
import { StorageKeys, loadJson, saveJson } from '@/services/storage';
import { newId } from '@/utils/ids';

interface SendBriefArgs {
  authorId: string;
  message: string;
  recipientIds: string[]; // employees to also DM
  toTeam: boolean;
}

interface ChatValue {
  threads: ChatThread[];
  messages: ChatMessage[];
  briefs: MorningBrief[];
  messagesForThread: (threadId: string) => ChatMessage[];
  teamThread: ChatThread | undefined;
  directThreadFor: (employeeId: string) => ChatThread | undefined;
  sendMessage: (threadId: string, senderId: string, text: string, kind?: MessageKind) => void;
  sendMorningBrief: (args: SendBriefArgs) => void;
}

const ChatContext = createContext<ChatValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [briefs, setBriefs] = useState<MorningBrief[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const seeded = await loadJson<boolean>(StorageKeys.seeded, false);
      if (seeded) {
        const [t, m, b] = await Promise.all([
          loadJson<ChatThread[]>(StorageKeys.threads, []),
          loadJson<ChatMessage[]>(StorageKeys.messages, []),
          loadJson<MorningBrief[]>(StorageKeys.briefs, []),
        ]);
        if (!mounted) return;
        setThreads(t);
        setMessages(m);
        setBriefs(b);
      } else {
        const t = seedThreads(seedMembers());
        const m = seedMessages();
        const b = seedBriefs();
        if (!mounted) return;
        setThreads(t);
        setMessages(m);
        setBriefs(b);
        void saveJson(StorageKeys.threads, t);
        void saveJson(StorageKeys.messages, m);
        void saveJson(StorageKeys.briefs, b);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /** Append a message and bump the parent thread's preview. */
  function appendMessage(msg: ChatMessage) {
    setMessages((prev) => {
      const next = [...prev, msg];
      void saveJson(StorageKeys.messages, next);
      return next;
    });
    setThreads((prev) => {
      const next = prev.map((t) =>
        t.id === msg.threadId
          ? { ...t, lastMessagePreview: msg.text, lastMessageAt: msg.createdAt }
          : t
      );
      void saveJson(StorageKeys.threads, next);
      return next;
    });
  }

  const sendMessage = (
    threadId: string,
    senderId: string,
    text: string,
    kind: MessageKind = 'text'
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    appendMessage({
      id: newId('msg'),
      threadId,
      senderId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      kind,
    });
  };

  const sendMorningBrief = ({ authorId, message, recipientIds, toTeam }: SendBriefArgs) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();

    const brief: MorningBrief = {
      id: newId('brief'),
      authorId,
      date: now.slice(0, 10),
      message: trimmed,
      sentToTeam: toTeam,
      recipientIds,
      createdAt: now,
    };
    setBriefs((prev) => {
      const next = [brief, ...prev];
      void saveJson(StorageKeys.briefs, next);
      return next;
    });

    // Fan-out: one message to the team thread + one to each employee's DM.
    const teamThread = threads.find((t) => t.type === 'team');
    if (toTeam && teamThread) {
      appendMessage({
        id: newId('msg'),
        threadId: teamThread.id,
        senderId: authorId,
        text: `☀️ Morgenbrief\n${trimmed}`,
        createdAt: now,
        kind: 'brief',
      });
    }
    for (const employeeId of recipientIds) {
      const tid = directThreadId(employeeId);
      appendMessage({
        id: newId('msg'),
        threadId: tid,
        senderId: authorId,
        text: `☀️ Morgenbrief\n${trimmed}`,
        createdAt: now,
        kind: 'brief',
      });
    }
  };

  const value = useMemo<ChatValue>(
    () => ({
      threads,
      messages,
      briefs,
      messagesForThread: (threadId: string) =>
        messages
          .filter((m) => m.threadId === threadId)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      teamThread: threads.find((t) => t.type === 'team'),
      directThreadFor: (employeeId: string) =>
        threads.find((t) => t.id === directThreadId(employeeId)),
      sendMessage,
      sendMorningBrief,
    }),
    [threads, messages, briefs]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

export { OWNER_ID };
