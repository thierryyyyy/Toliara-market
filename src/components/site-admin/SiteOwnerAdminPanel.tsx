import { useMemo, useState } from 'react';
/**
 * V1650 - Interface /admin : sections par collection runtime (SCHEMA.json / Supabase).
 */
import {
  useSiteOwnerRuntime,
  type RuntimeCollectionItem,
  type RuntimeFieldDef,
} from '@/hooks/useSiteOwnerRuntime';

const HIDDEN_SCHEMAS = new Set(["users", "schema_migrations"]);

function fieldKeys(schema: { fields: Record<string, RuntimeFieldDef>; fieldOrder?: string[] }): string[] {
  if (schema.fieldOrder?.length) return schema.fieldOrder;
  return Object.keys(schema.fields || {});
}

function FieldInput({
  fieldKey,
  def,
  value,
  onChange,
}: {
  fieldKey: string;
  def: RuntimeFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = def.label || fieldKey;
  const type = def.type || 'text';
  if (type === "boolean") {
    return (
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }
  if (type === "textarea") {
    return (
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</span>
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
        />
      </label>
    );
  }
  if (type === "number") {
    return (
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</span>
        <input
          type="number"
          value={value === undefined || value === null ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
        />
      </label>
    );
  }
  if (type === "select" && def.options?.length) {
    return (
      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</span>
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
        >
          <option value="">-</option>
          {def.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</span>
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }}
      />
    </label>
  );
}

export default function SiteOwnerAdminPanel() {
  const { schemas, data, loading, error, saving, reload, saveCollection, manageUrl } =
    useSiteOwnerRuntime();
  const collectionIds = useMemo(
    () => Object.keys(schemas).filter((id) => !HIDDEN_SCHEMAS.has(id)).sort(),
    [schemas],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RuntimeCollectionItem | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeSchema = activeId ? schemas[activeId] : undefined;
  const items = activeId ? data[activeId] || [] : [];

  const startNew = () => {
    if (!activeId || !activeSchema) return;
    const id = `new_${Date.now()}`;
    const blank: RuntimeCollectionItem = { id };
    for (const k of fieldKeys(activeSchema)) blank[k] = "";
    setEditId(id);
    setDraft(blank);
  };

  const startEdit = (item: RuntimeCollectionItem) => {
    setEditId(item.id);
    setDraft({ ...item });
  };

  const persistDraft = async () => {
    if (!activeId || !draft) return;
    setLocalError(null);
    const list = [...(data[activeId] || [])];
    const idx = list.findIndex((r) => r.id === draft.id);
    if (idx >= 0) list[idx] = draft;
    else list.push(draft);
    try {
      await saveCollection(activeId, list);
      setEditId(null);
      setDraft(null);
    } catch (err: unknown) {
      setLocalError("Échec de la sauvegarde - vérifiez que vous êtes connecté en tant que propriétaire.");
    }
  };

  const removeItem = async (itemId: string) => {
    if (!activeId) return;
    const list = (data[activeId] || []).filter((r) => r.id !== itemId);
    try {
      await saveCollection(activeId, list);
      if (editId === itemId) {
        setEditId(null);
        setDraft(null);
      }
    } catch (err: unknown) {
      setLocalError("Suppression impossible.");
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Chargement des paramètres métier...</p>;
  }

  return (
    <div style={{ display: "flex", minHeight: "70vh", fontFamily: "system-ui, sans-serif" }}>
      <aside
        style={{
          width: 260,
          borderRight: "1px solid #e2e8f0",
          padding: 16,
          background: "#f8fafc",
        }}
      >
        <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Paramètres</h2>
        {collectionIds.length === 0 ? (
          <p style={{ fontSize: 13, color: "#64748b" }}>
            Aucune collection. Initialisez les données depuis Constructor → Gérer le contenu.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {collectionIds.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(id);
                    setEditId(null);
                    setDraft(null);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    marginBottom: 4,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: activeId === id ? "#e0e7ff" : "transparent",
                  }}
                >
                  {schemas[id]?.icon || '📋'} {schemas[id]?.name || id}
                </button>
              </li>
            ))}
          </ul>
        )}
        {manageUrl ? (
          <p style={{ marginTop: 16, fontSize: 12 }}>
            <a href={manageUrl} target="_blank" rel="noreferrer">
              Ouvrir aussi " Gérer le contenu " sur Constructor
            </a>
          </p>
        ) : null}
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        {(error || localError) && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error || localError}
          </div>
        )}
        {!activeId ? (
          <p style={{ color: "#64748b" }}>Choisissez une section à gauche.</p>
        ) : (
          <>
            <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 20 }}>{activeSchema?.name || activeId}</h1>
                {activeSchema?.description ? (
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
                    {activeSchema.description}
                  </p>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => void reload()} disabled={saving}>
                  Actualiser
                </button>
                <button type="button" onClick={startNew} disabled={saving}>
                  + Ajouter
                </button>
              </div>
            </header>
            {editId && draft && activeSchema ? (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                  background: "#fff",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Édition</h3>
                {fieldKeys(activeSchema).map((k) => (
                  <FieldInput
                    key={k}
                    fieldKey={k}
                    def={activeSchema.fields[k] || { type: "text" }}
                    value={draft[k]}
                    onChange={(v) => setDraft((d) => (d ? { ...d, [k]: v } : d))}
                  />
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => void persistDraft()} disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setDraft(null);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : null}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: 8 }}>Titre</th>
                  <th style={{ padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const titleKey = activeSchema?.titleField || fieldKeys(activeSchema!)[0] || 'id';
                  const title = String(item[titleKey] ?? item.id);
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: 8 }}>{title}</td>
                      <td style={{ padding: 8 }}>
                        <button type="button" onClick={() => startEdit(item)} style={{ marginRight: 8 }}>
                          Modifier
                        </button>
                        <button type="button" onClick={() => void removeItem(item.id)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {items.length === 0 && !editId ? (
              <p style={{ color: "#94a3b8", marginTop: 16 }}>Aucune entrée - ajoutez la première.</p>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
