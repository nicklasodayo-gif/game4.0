import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, LoadingScreen } from '@red-giant/ui';
import { formatTime } from '@red-giant/game-engine';
import { fetchLeaderboard, fetchAnalyticsSummary, type LeaderboardEntryDTO, type AnalyticsSummary } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const BRANDS = ['redgiant', 'cocacola', 'demo'] as const;

const DASHBOARD_THEME = {
  primary: '#6366F1',
  background: '#020617',
  backgroundLight: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
};

export function Dashboard() {
  const navigate = useNavigate();
  const { email, logout } = useAuthStore();

  const [brand, setBrand] = useState<(typeof BRANDS)[number]>('redgiant');
  const [scores, setScores] = useState<LeaderboardEntryDTO[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (selectedBrand: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [leaderboard, analyticsSummary] = await Promise.all([
        fetchLeaderboard(selectedBrand),
        fetchAnalyticsSummary(selectedBrand),
      ]);
      setScores(leaderboard);
      setSummary(analyticsSummary);
    } catch (err) {
      setError('Could not reach the backend. Is it running at VITE_API_URL?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(brand);
  }, [brand, load]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Red Giant Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Signed in as {email}</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="flex gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                brand === b ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {isLoading ? (
          <LoadingScreen theme={DASHBOARD_THEME} message="Loading dashboard…" />
        ) : (
          <>
            {summary && (
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Games" value={summary.totalGames} />
                <StatCard label="Completed" value={summary.completedGames} />
                <StatCard label="Completion Rate" value={`${summary.completionRate}%`} />
                <StatCard label="Leads Captured" value={summary.totalLeads} />
              </section>
            )}

            <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h2 className="font-semibold">Leaderboard — {brand}</h2>
              </div>
              <table className="w-full text-sm">
                <thead className="text-slate-400 text-left">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Moves</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No scores yet for this brand.
                      </td>
                    </tr>
                  ) : (
                    scores.map((score) => (
                      <tr key={score.rank} className="border-t border-slate-800">
                        <td className="px-6 py-3">{score.rank}</td>
                        <td className="px-6 py-3">{score.name}</td>
                        <td className="px-6 py-3">{formatTime(score.time)}</td>
                        <td className="px-6 py-3">{score.moves}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Dashboard;
