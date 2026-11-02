"use client";

import { useState } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { Bot, Send, Sparkles, ShieldAlert, CheckCircle2, PhoneCall, AlertTriangle, ArrowRight } from "lucide-react";

interface Message {
  sender: "user" | "assistant";
  text?: string;
  data?: any;
  model?: string;
  timestamp: string;
}

export default function AssistantPage() {
  const [district, setDistrict] = useState(ODISHA_DISTRICTS[0].name);
  const [language, setLanguage] = useState<"en" | "hi" | "or">("en");
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "assistant",
      text: "Hello! I am DisasterSense AI, your evidence-grounded resilience assistant for Odisha. I analyze operational weather models, GloFAS river discharge hydrology, and verified MPCS shelters. How can I help your family prepare today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const presetQueries = [
    "What is the cyclone and storm surge risk in my district right now?",
    "Explain the river discharge flood indicator in plain terms.",
    "Generate a 72-hour family cyclone emergency checklist.",
    "Where is the nearest verified Multipurpose Cyclone Shelter (MPCS)?"
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          district,
          language
        })
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const botMsg: Message = {
          sender: "assistant",
          data: resData.data,
          model: resData.model,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const errorMsg: Message = {
          sender: "assistant",
          text: "I encountered an issue synthesizing telemetry. Please review the live dashboard directly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-6rem)] flex flex-col">
      {/* Assistant Header & Controls */}
      <div className="glass-panel p-4 rounded-xl border border-atmosphere-border mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-atmosphere-surface border border-atmosphere-border flex items-center justify-center text-atmosphere-ice shadow-glow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold font-heading text-atmosphere-text flex items-center gap-2">
              Gemini Disaster Resilience Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-atmosphere-surface text-atmosphere-teal border border-atmosphere-border">
                Grounding Engine
              </span>
            </h1>
            <p className="text-xs font-mono text-atmosphere-muted">
              Zero-Hallucination Guardrails &bull; Evidence Citations &bull; Multilingual
            </p>
          </div>
        </div>

        {/* District & Language Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text text-xs rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-atmosphere-ice"
          >
            {ODISHA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-atmosphere-border bg-atmosphere-surface p-0.5 text-xs font-mono">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded text-[11px] ${language === "en" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded text-[11px] ${language === "hi" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              HI
            </button>
            <button
              onClick={() => setLanguage("or")}
              className={`px-2 py-1 rounded text-[11px] ${language === "or" ? "bg-atmosphere-ice text-atmosphere-bg font-bold" : "text-atmosphere-muted"}`}
            >
              ଓଡ଼ିଆ
            </button>
          </div>
        </div>
      </div>

      {/* Preset Queries Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 shrink-0 scrollbar-none">
        <span className="text-[11px] font-mono text-atmosphere-muted uppercase flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-atmosphere-ice" />
          Presets:
        </span>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-xs px-3 py-1 rounded-full glass-panel border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-muted hover:text-atmosphere-ice whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 glass-panel rounded-2xl p-4 border border-atmosphere-border">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-atmosphere-ice text-atmosphere-bg font-medium"
                  : "glass-panel-elevated text-atmosphere-text border border-atmosphere-border/80"
              }`}
            >
              {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}

              {/* Structured Grounded Output from Gemini */}
              {m.data && (
                <div className="space-y-3 font-sans">
                  {/* Summary & Risk Level */}
                  <div className="flex items-start justify-between gap-2 border-b border-atmosphere-border/50 pb-2">
                    <p className="font-semibold text-atmosphere-text text-sm">{m.data.summary}</p>
                    {m.data.riskLevel && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-atmosphere-ice/20 text-atmosphere-ice border border-atmosphere-ice/40 shrink-0">
                        {m.data.riskLevel}
                      </span>
                    )}
                  </div>

                  {/* Evidence Citations */}
                  {m.data.evidenceCited && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-atmosphere-teal tracking-wider block">
                        Retrieved Evidence Grounding:
                      </span>
                      {m.data.evidenceCited.map((ev: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-atmosphere-muted text-[11px] font-mono">
                          <CheckCircle2 className="w-3 h-3 text-atmosphere-safe shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preparedness Checklist */}
                  {m.data.preparednessChecklist && (
                    <div className="space-y-1 pt-2 border-t border-atmosphere-border/40">
                      <span className="text-[10px] font-mono uppercase text-atmosphere-ice tracking-wider block">
                        Citizen Preparedness Protocol:
                      </span>
                      {m.data.preparednessChecklist.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-atmosphere-text text-xs">
                          <span className="text-atmosphere-ice">&bull;</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Official Contacts & Disclaimers */}
                  <div className="pt-2 border-t border-atmosphere-border/40 text-[10px] font-mono text-atmosphere-muted/80">
                    <p className="text-atmosphere-warning/90 mb-1">
                      ⚠️ {m.data.officialDisclaimer}
                    </p>
                    <div className="flex items-center gap-1 text-atmosphere-muted">
                      <PhoneCall className="w-3 h-3 text-atmosphere-safe" />
                      <span>{m.data.emergencyContacts?.slice(0, 2).join(" | ")}</span>
                    </div>
                  </div>
                </div>
              )}

              <span className={`text-[10px] font-mono mt-2 block ${m.sender === "user" ? "text-atmosphere-bg/80" : "text-atmosphere-muted/60"}`}>
                {m.timestamp} {m.model && `&bull; Model: ${m.model}`}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-xl glass-panel text-xs font-mono text-atmosphere-muted">
            <div className="w-4 h-4 rounded-full border-2 border-atmosphere-ice border-t-transparent animate-spin"></div>
            <span>Grounding query with retrieved numerical models & GloFAS indicators...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask about storm surges, flood discharges, or shelters in ${district}...`}
          className="flex-1 bg-atmosphere-surface border border-atmosphere-border rounded-xl px-4 py-3 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-atmosphere-ice to-atmosphere-teal text-atmosphere-bg font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-glow"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
