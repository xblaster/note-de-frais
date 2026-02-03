import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Receipt,
  LogOut,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  User,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import apiClient from '../api/api-client';
import { formatCurrency, formatDate } from '../lib/utils';

interface Expense {
  id: string;
  amount: number;
  date: string;
  vendor: string | null;
  status: string;
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
  viewMode: 'grid' | 'list';
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
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

function ExpenseCard({ expense, viewMode }: ExpenseCardProps) {
  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success/10 text-success border-success/20';
      case 'REJECTED':
        return 'bg-error/10 text-error border-error/20';
      case 'SUBMITTED':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
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
      case 'DRAFT':
        return 'Brouillon';
      default:
        return status;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Receipt className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {expense.vendor || 'Note de frais'}
            </h3>
            <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="font-bold text-foreground">{formatCurrency(expense.amount)}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border mt-1 ${getStatusStyles(expense.status)}`}>
              {getStatusLabel(expense.status)}
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusStyles(expense.status)}`}>
            {getStatusLabel(expense.status)}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground truncate">
            {expense.vendor || 'Note de frais'}
          </h3>
          <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 bg-card/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Montant</span>
          <span className="font-bold text-foreground">{formatCurrency(expense.amount)}</span>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-card'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}

function LoadingSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`bg-card border border-border rounded-xl overflow-hidden animate-pulse ${
            viewMode === 'list' ? 'h-20' : 'h-48'
          }`}
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

function EmptyState() {
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
      <button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
        <Plus className="w-5 h-5" />
        <span>Nouvelle dépense</span>
      </button>
    </motion.div>
  );
}

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

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

  const handleLogout = (): void => {
    localStorage.clear();
    navigate('/');
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingCount = expenses.filter((e) => e.status === 'SUBMITTED').length;
  const approvedCount = expenses.filter((e) => e.status === 'APPROVED').length;

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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">Note de Frais</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={LayoutGrid} label="Tableau de bord" active />
          <SidebarItem icon={Receipt} label="Mes dépenses" />
          <SidebarItem icon={User} label="Profil" />
        </nav>

        <div className="p-4 border-t border-border">
          <SidebarItem icon={LogOut} label="Déconnexion" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher une dépense..."
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{userEmail}</p>
                <p className="text-xs text-muted-foreground">Utilisateur</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Mes Notes de Frais</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez vos dépenses professionnelles
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-card border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>

                <button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nouvelle dépense</span>
                </button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total des dépenses"
                value={formatCurrency(totalAmount)}
                icon={TrendingUp}
                variant="primary"
                index={0}
              />
              <StatCard
                label="En attente"
                value={`${pendingCount} note${pendingCount > 1 ? 's' : ''}`}
                icon={Clock}
                variant="warning"
                index={1}
              />
              <StatCard
                label="Approuvées"
                value={`${approvedCount} note${approvedCount > 1 ? 's' : ''}`}
                icon={CheckCircle2}
                variant="success"
                index={2}
              />
            </div>

            {/* Expenses Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Dépenses récentes
                  {expenses.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({expenses.length})
                    </span>
                  )}
                </h2>
                <button className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-3'}
                >
                  {loading ? (
                    <LoadingSkeleton viewMode={viewMode} />
                  ) : expenses.length > 0 ? (
                    expenses.map((expense) => (
                      <motion.div key={expense.id} variants={itemVariants}>
                        <ExpenseCard expense={expense} viewMode={viewMode} />
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState />
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
