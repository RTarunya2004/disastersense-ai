"use client";

import { useState, useEffect } from "react";
import { ODISHA_DISTRICTS } from "@/data/odishaDistricts";
import { CommunityReport } from "@/types";
import { AlertTriangle, Plus, ThumbsUp, MapPin, CheckCircle2, Clock, Send, ShieldAlert, Filter } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [district, setDistrict] = useState(ODISHA_DISTRICTS[0].name);
  const [locationName, setLocationName] = useState("");
  const [category, setCategory] = useState<any>("Waterlogging / Flood");
  const [severity, setSeverity] = useState<any>("MEDIUM");
  const [description, setDescription] = useState("");
  const [reporterAlias, setReporterAlias] = useState("");

  const [filterDistrict, setFilterDistrict] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?district=${encodeURIComponent(filterDistrict)}&category=${encodeURIComponent(filterCategory)}`);
      if (res.ok) {
        const d = await res.json();
        setReports(d.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterDistrict, filterCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !description) return;
    setIsSubmitting(true);

    const distObj = ODISHA_DISTRICTS.find(d => d.name === district) || ODISHA_DISTRICTS[0];

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          locationName,
          category,
          severity,
          description,
          reporterAlias: reporterAlias || "Anonymous Resident",
          coordinates: {
            lat: distObj.coordinates.lat + (Math.random() - 0.5) * 0.05,
            lng: distObj.coordinates.lng + (Math.random() - 0.5) * 0.05,
          }
        })
      });

      if (res.ok) {
        setShowForm(false);
        setLocationName("");
        setDescription("");
        setReporterAlias("");
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch("/api/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, upvote: true })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-atmosphere-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-atmosphere-text">
            Citizen Incident Crowdsourcing & Incident Triage
          </h1>
          <p className="text-xs font-mono text-atmosphere-muted">
            Ground-level community reporting &bull; Mandatory "Unverified" initial status &bull; Community peer validation
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-atmosphere-severe/20 text-atmosphere-severe border border-atmosphere-severe/40 hover:bg-atmosphere-severe/30 text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-hazard"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? "Cancel Submission" : "Submit Ground Incident"}</span>
        </button>
      </div>

      {/* Submission Form Modal / Panel */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel-elevated p-6 rounded-2xl border border-atmosphere-severe/50 space-y-4">
          <div className="flex items-center gap-2 text-atmosphere-severe font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Submit Local Hazard Observation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Odisha District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
              >
                {ODISHA_DISTRICTS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
              >
                <option value="Waterlogging / Flood">Waterlogging / Flood</option>
                <option value="Tree / Powerline Down">Tree / Powerline Down</option>
                <option value="Structural Damage">Structural Damage</option>
                <option value="Road Blocked">Road Blocked</option>
                <option value="Shelter Need">Shelter Need</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Observed Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
              >
                <option value="LOW">Low (Passable / Minor)</option>
                <option value="MEDIUM">Medium (Caution / Delay)</option>
                <option value="HIGH">High (Severe Disruption)</option>
                <option value="CRITICAL">Critical (Life Threat / Stranded)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Specific Location / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Near Rasulgarh Flyover underpass, Bhubaneswar"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-atmosphere-muted block mb-1">Reporter Name / Alias</label>
              <input
                type="text"
                placeholder="e.g. Subrat P. / Ward Volunteer"
                value={reporterAlias}
                onChange={(e) => setReporterAlias(e.target.value)}
                className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-atmosphere-muted block mb-1">Description of Situation</label>
            <textarea
              placeholder="Describe actual ground condition, water level estimate, or blockage details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-atmosphere-surface border border-atmosphere-border rounded-lg px-3 py-2 text-xs font-mono text-atmosphere-text focus:outline-none focus:border-atmosphere-ice"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-atmosphere-muted">
              Note: Report will be submitted with initial status <strong className="text-atmosphere-warning">UNVERIFIED</strong> to prevent false alarms.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-atmosphere-ice text-atmosphere-bg font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Publish Report"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        <span className="text-atmosphere-muted flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter By:
        </span>
        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text rounded-lg px-3 py-1.5 focus:outline-none focus:border-atmosphere-ice"
        >
          <option value="ALL">All Districts</option>
          {ODISHA_DISTRICTS.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-atmosphere-surface border border-atmosphere-border text-atmosphere-text rounded-lg px-3 py-1.5 focus:outline-none focus:border-atmosphere-ice"
        >
          <option value="ALL">All Categories</option>
          <option value="Waterlogging / Flood">Waterlogging / Flood</option>
          <option value="Tree / Powerline Down">Tree / Powerline Down</option>
          <option value="Road Blocked">Road Blocked</option>
          <option value="Shelter Need">Shelter Need</option>
        </select>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-xs font-mono text-atmosphere-muted">
            No incident reports found matching current filters.
          </div>
        ) : (
          reports.map((rep) => (
            <div key={rep.id} className="glass-panel p-5 rounded-2xl border border-atmosphere-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    rep.status === "VERIFIED" ? "bg-atmosphere-safe/20 text-atmosphere-safe border border-atmosphere-safe/40" :
                    rep.status === "UNDER_REVIEW" ? "bg-atmosphere-warning/20 text-atmosphere-warning border border-atmosphere-warning/40" :
                    "bg-atmosphere-surface text-atmosphere-muted border border-atmosphere-border"
                  }`}>
                    {rep.status} CITIZEN REPORT
                  </span>
                  <span className="text-xs font-bold text-atmosphere-ice">{rep.category}</span>
                  <span className="text-xs font-mono text-atmosphere-muted">&bull; {rep.district}</span>
                </div>

                <h3 className="text-sm font-bold text-atmosphere-text">{rep.locationName}</h3>
                <p className="text-xs text-atmosphere-muted leading-relaxed">{rep.description}</p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-atmosphere-muted/80 pt-1">
                  <span>Reported by: {rep.reporterAlias}</span>
                  <span>{new Date(rep.reportedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
                </div>
              </div>

              {/* Upvote Button */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleUpvote(rep.id)}
                  className="px-3.5 py-2 rounded-xl bg-atmosphere-surface border border-atmosphere-border hover:border-atmosphere-ice text-atmosphere-ice text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{rep.upvotes} Confirmations</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
