import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  LogOut,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/api-client';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { useDebounce } from '../hooks/use-debounce';

interface Expense {
  id: string;
  amount: number;
  date: string;
  vendor: string | null;
  status: string;
  user: {
    email: string;
  };
}

export default function AdminDashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const response = await apiClient.get<Expense[]>('/expenses/all');
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch all expenses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllExpenses();
  }, []);

  const handleLogout = (): void => {
    localStorage.clear();
    navigate('/');
  };

  const filteredExpenses = useMemo(() => {
    if (!debouncedSearch) return expenses;
    const query = debouncedSearch.toLowerCase();
    return expenses.filter(e =>
      e.vendor?.toLowerCase().includes(query) ||
      e.user.email.toLowerCase().includes(query) ||
      e.amount.toString().includes(query)
    );
  }, [expenses, debouncedSearch]);

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter(e => e.status === 'SUBMITTED').length,
    approved: expenses.filter(e => e.status === 'APPROVED').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Admin Console</span>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par utilisateur, fournisseur..."
                className="w-full bg-input/50 border border-border rounded-xl pl-10 pr-10 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userEmail}</p>
                <p className="text-xs text-primary font-bold">ADMINISTRATEUR</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-error rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-muted-foreground">Vue d'ensemble de toutes les dépenses du système</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <TrendingUp className="w-6 h-6 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Volume Total</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <Clock className="w-6 h-6 text-warning mb-4" />
              <p className="text-sm text-muted-foreground mb-1">En attente de validation</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <CheckCircle2 className="w-6 h-6 text-success mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Approuvées</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-sm font-bold text-foreground">Utilisateur</th>
                  <th className="px-6 py-4 text-sm font-bold text-foreground">Fournisseur</th>
                  <th className="px-6 py-4 text-sm font-bold text-foreground">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-foreground">Montant</th>
                  <th className="px-6 py-4 text-sm font-bold text-foreground">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Chargement...</td></tr>
                ) : filteredExpenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{expense.user.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{expense.vendor || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(expense.date)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">{formatCurrency(expense.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider",
                        expense.status === 'APPROVED' ? 'bg-success/10 text-success border-success/20' :
                        expense.status === 'SUBMITTED' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-muted/10 text-muted-foreground border-muted/20'
                      )}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
