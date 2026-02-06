import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Receipt,
  LogOut,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  User,
  ChevronRight,
  AlertTriangle,
  X,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import apiClient from '../api/api-client';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { useDebounce } from '../hooks/use-debounce';

interface Expense {
  id: string;
  amount: number;
  date: string;
  vendor: string | null;
  status: string;
  description?: string;
  rejectionReason?: string;
  category?: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  variant: 'primary' | 'warning' | 'success';
  index: number;
}

interface ExpenseCardProps {
  expense: Expense;
  priority?: boolean;
  onDelete: (id: string) => void;
}

interface FilterChip {
  label: string;
  status: string | 'ALL';
  count: number;
}

function StatCard({ label, value, icon: Icon, variant, index }: StatCardProps) {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    success: 'bg-success/10 text-success border-success/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${variantClasses[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

function ExpenseCard({ expense, priority, onDelete }: ExpenseCardProps) {
  const navigate = useNavigate();

  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success/10 text-success border-success/20';
      case 'REJECTED':
        return 'bg-error/10 text-error border-error/20';
      case 'SUBMITTED':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'REVISION_REQUESTED':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'DRAFT':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/5 text-muted-foreground border-muted/10';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'Approuvé';
      case 'REJECTED':
        return 'Rejeté';
      case 'SUBMITTED':
        return 'En attente';
      case 'REVISION_REQUESTED':
        return 'À réviser';
      case 'DRAFT':
        return 'Brouillon';
      default:
        return status;
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (expense.status === 'DRAFT' || expense.status === 'REVISION_REQUESTED') {
      navigate(`/expenses/edit/${expense.id}`);
    } else if (expense.status === 'REJECTED') {
      // For REJECTED, maybe we also want to allow editing or just view
      navigate(`/expenses/edit/${expense.id}`);
    } else {
      navigate(`/expenses/${expense.id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      onDelete(expense.id);
    }
  };

  return (
    <div
      onClick={() => navigate((expense.status === 'DRAFT' || expense.status === 'REVISION_REQUESTED' || expense.status === 'REJECTED') ? `/expenses/edit/${expense.id}` : `/expenses/${expense.id}`)}
      className={cn(
        "bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden",
        priority && "border-l-4 border-l-warning bg-warning/5"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Receipt className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusStyles(expense.status)}`}>
              {getStatusLabel(expense.status)}
            </span>
            {expense.approvedAt && (
              <span className="text-[10px] text-muted-foreground"> le {formatDate(expense.approvedAt)}</span>
            )}
          </div>
          <h3 className="font-bold text-foreground truncate text-lg">
            {expense.vendor || 'Note de frais'}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDate(expense.date)}
            {expense.category && <span className="flex items-center gap-1 before:content-['•'] before:mx-1">{expense.category}</span>}
          </p>
          {(expense.status === 'REJECTED' || expense.status === 'REVISION_REQUESTED') && expense.rejectionReason && (
            <p className={cn(
              "text-xs font-medium mt-2 p-2 rounded-lg border flex items-start gap-1.5",
              expense.status === 'REJECTED' ? "bg-error/10 border-error/20 text-error" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            )}>
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {expense.rejectionReason}
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
          <p className="font-extrabold text-xl text-foreground selection:bg-primary/30">{formatCurrency(expense.amount)}</p>
          <button
            onClick={handleAction}
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group/btn"
          >
            {expense.status === 'DRAFT' ? 'Terminer' : (expense.status === 'REJECTED' || expense.status === 'REVISION_REQUESTED') ? 'Corriger' : 'Voir'}
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          {(expense.status === 'DRAFT' || expense.status === 'REJECTED') && (
            <button
              onClick={handleDelete}
              className="text-sm font-semibold text-error hover:text-error/80 flex items-center gap-1 group/del mt-1"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-xl h-20 animate-pulse"
        >
          <div className="p-6 space-y-3">
            <div className="h-4 bg-muted/20 rounded w-3/4"></div>
            <div className="h-3 bg-muted/20 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyState({ onNewExpense }: { onNewExpense: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 bg-muted/10 border border-border rounded-xl flex items-center justify-center mb-4">
        <Receipt className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Aucune dépense</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Vous n'avez pas encore de notes de frais. Créez votre première dépense pour commencer.
      </p>
      <button
        onClick={onNewExpense}
        className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>Nouvelle dépense</span>
      </button>
    </motion.div>
  );
}

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [sortOption, setSortOption] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchExpenses = async (): Promise<void> => {
      try {
        const response = await apiClient.get<Expense[]>('/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleDeleteExpense = async (id: string) => {
    try {
      await apiClient.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete expense', error);
      alert('Une erreur est survenue lors de la suppression.');
    }
  };

  const handleLogout = (): void => {
    localStorage.clear();
    navigate('/');
  };

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Apply status filter
    if (activeFilter !== 'ALL') {
      result = result.filter(e => e.status === activeFilter);
    }

    // Apply search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(e =>
        e.vendor?.toLowerCase().includes(query) ||
        e.amount.toString().includes(query) ||
        e.description?.toLowerCase().includes(query) ||
        e.category?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortOption === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'amount-desc') return b.amount - a.amount;
      if (sortOption === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, activeFilter, debouncedSearch, sortOption]);

  const actionableExpenses = useMemo(() => {
    return expenses.filter(e => e.status === 'DRAFT' || e.status === 'REJECTED' || e.status === 'REVISION_REQUESTED');
  }, [expenses]);

  const filterConfigs: FilterChip[] = [
    { label: 'Toutes', status: 'ALL', count: expenses.length },
    { label: 'Brouillons', status: 'DRAFT', count: expenses.filter(e => e.status === 'DRAFT').length },
    { label: 'À réviser', status: 'REVISION_REQUESTED', count: expenses.filter(e => e.status === 'REVISION_REQUESTED').length },
    { label: 'En attente', status: 'SUBMITTED', count: expenses.filter(e => e.status === 'SUBMITTED').length },
    { label: 'Approuvées', status: 'APPROVED', count: expenses.filter(e => e.status === 'APPROVED').length },
    { label: 'Rejetées', status: 'REJECTED', count: expenses.filter(e => e.status === 'REJECTED').length },
  ];

  const stats = {
    total: expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0),
    pending: expenses.filter((e: Expense) => e.status === 'SUBMITTED').length,
    approved: expenses.filter((e: Expense) => e.status === 'APPROVED').length,
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground hidden md:block">Note de Frais</span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par fournisseur, montant..."
                  className="w-full bg-input/50 border border-border rounded-xl pl-10 pr-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              {userRole === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center gap-2"
                  title="Administration"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-sm font-bold hidden lg:block">Admin</span>
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{userEmail}</p>
                  <p className="text-xs text-muted-foreground">Utilisateur</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="h-6 w-[1px] bg-border mx-1" />
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-all"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 selection:bg-primary/30">Mes Notes de Frais</h1>
                <p className="text-muted-foreground">
                  Gérez et suivez vos dépenses professionnelles
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/expenses/new')}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 inline-flex items-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span>Nouvelle dépense</span>
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total des dépenses"
                value={formatCurrency(stats.total)}
                icon={TrendingUp}
                variant="primary"
                index={0}
              />
              <StatCard
                label="En attente"
                value={`${stats.pending} note${stats.pending > 1 ? 's' : ''}`}
                icon={Clock}
                variant="warning"
                index={1}
              />
              <StatCard
                label="Approuvées"
                value={`${stats.approved} note${stats.approved > 1 ? 's' : ''}`}
                icon={CheckCircle2}
                variant="success"
                index={2}
              />
            </div>

            {/* Filtering & Sorting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
              <div className="flex flex-wrap gap-2">
                {filterConfigs.map((filter) => (
                  <button
                    key={filter.status}
                    onClick={() => setActiveFilter(filter.status)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                      activeFilter === filter.status
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    {filter.label}
                    <span className={cn(
                      "ml-2 text-xs opacity-60",
                      activeFilter === filter.status ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      ({filter.count})
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">Trier par :</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-card border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="date-desc">Plus récent</option>
                  <option value="date-asc">Plus ancien</option>
                  <option value="amount-desc">Montant décroissant</option>
                  <option value="amount-asc">Montant croissant</option>
                </select>
              </div>
            </div>

            {/* Action Required Section */}
            {actionableExpenses.length > 0 && activeFilter === 'ALL' && !searchQuery && (
              <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Nécessite une action ({actionableExpenses.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {actionableExpenses.map(expense => (
                    <ExpenseCard key={expense.id} expense={expense} priority onDelete={handleDeleteExpense} />
                  ))}
                </div>
              </section>
            )}

            {/* Expenses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {searchQuery ? 'Résultats de recherche' : 'Toutes les dépenses'}
                  {filteredExpenses.length > 0 && (
                    <span className="ml-2 text-lg font-normal text-muted-foreground">
                      ({filteredExpenses.length})
                    </span>
                  )}
                </h2>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Effacer la recherche
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeFilter}-${debouncedSearch}-${sortOption}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {loading ? (
                    <LoadingSkeleton />
                  ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <motion.div key={expense.id} variants={itemVariants}>
                        <ExpenseCard expense={expense} onDelete={handleDeleteExpense} />
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState onNewExpense={() => navigate('/expenses/new')} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}