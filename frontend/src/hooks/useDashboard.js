import { useState, useEffect, useCallback } from "react";
import { dashboardAPI } from "../services/api";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.get();
      setData(res.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useReferralTree() {
  const [tree, setTree] = useState(null);
  const [levelStats, setLevelStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardAPI.referralTree()
      .then((res) => { setTree(res.tree); setLevelStats(res.levelStats); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { tree, levelStats, loading, error };
}

export function useROIHistory() {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    dashboardAPI.roiHistory(page)
      .then((res) => { setHistory(res.history); setTotal(res.total); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  return { history, total, page, setPage, loading, error };
}
