import { useState } from "react";
import { useReferralTree } from "../../hooks/useDashboard";

const LEVEL_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n ?? 0);

function TreeNode({ node, level = 1 }) {
  const [expanded, setExpanded] = useState(level === 1);
  const color = LEVEL_COLORS[(level - 1) % LEVEL_COLORS.length];
  const hasChildren = node.children?.length > 0;

  return (
    <div className="tree-node" style={{ "--lc": color }}>
      <div className="tree-row" onClick={() => hasChildren && setExpanded(!expanded)}>
        <div className="tree-indicator" />
        <div className="tree-info">
          <span className="tree-name">{node.name}</span>
          <span className="tree-email">{node.email}</span>
        </div>
        <div className="tree-meta">
          <span className="tree-invested">{fmt(node.totalInvested)}</span>
          <span className="tree-level-badge" style={{ background: color }}>L{level}</span>
        </div>
        {hasChildren && (
          <span className="tree-toggle">{expanded ? "▾" : "▸"} {node.children.length}</span>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReferralTree() {
  const { tree, levelStats, loading, error } = useReferralTree();

  if (loading) return (
    <div className="card">
      <h2 className="card-title">Referral Network</h2>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-row" style={{ marginLeft: i * 20 }} />)}
    </div>
  );

  if (error) return <div className="card"><p className="form-error">{error}</p></div>;

  return (
    <div className="card">
      <h2 className="card-title">Referral Network</h2>

      {/* Level stats summary */}
      {Object.keys(levelStats).length > 0 && (
        <div className="level-stats">
          {Object.entries(levelStats).map(([lvl, stat]) => (
            <div key={lvl} className="level-stat-pill" style={{ "--lc": LEVEL_COLORS[(lvl - 1) % LEVEL_COLORS.length] }}>
              <strong>Level {lvl}</strong>
              <span>{stat.count} member{stat.count !== 1 ? "s" : ""}</span>
              <span>{fmt(stat.totalInvested)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tree */}
      {tree?.length === 0 ? (
        <p className="empty-state">No referrals yet. Share your referral code to grow your network!</p>
      ) : (
        <div className="tree-container">
          {tree?.map((node) => <TreeNode key={node._id} node={node} level={1} />)}
        </div>
      )}
    </div>
  );
}
