import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Send, Calendar, Euro, Building, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ReceiptCapture from '../components/ReceiptCapture';
import apiClient from '../api/api-client';

export default function CreateExpensePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.date) {
            setError('Le montant et la date sont requis.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('Utilisateur non connecté');

            const data = new FormData();
            data.append('amount', formData.amount);
            data.append('date', formData.date);
            data.append('vendor', formData.vendor);
            data.append('userId', userId);
            if (receiptFile) {
                data.append('receipt', receiptFile);
            }

            await apiClient.post('/expenses', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/dashboard');
        } catch (err: any) {
            console.error('Failed to create expense:', err);
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la création de la dépense.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Retour au tableau de bord</span>
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">Nouvelle Dépense</h1>
                    <p className="text-muted-foreground mt-1">Saisissez les détails de votre note de frais.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/20"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                                        Montant
                                    </label>
                                    <div className="relative">
                                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            id="date"
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="vendor" className="block text-sm font-medium text-foreground mb-2">
                                        Marchand / Fournisseur
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            id="vendor"
                                            type="text"
                                            value={formData.vendor}
                                            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                                            placeholder="Ex: Starbucks, Uber, Amazon..."
                                            className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 px-6 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted/10 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                                >
                                    {loading ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    <span>Soumettre</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Capture Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/20">
                            <ReceiptCapture onCapture={setReceiptFile} />
                        </div>

                        <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Conseils
                            </h3>
                            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                <li>Assurez-vous que le montant et la date sont bien lisibles.</li>
                                <li>Stockage local sécurisé pour vos documents.</li>
                                <li>Le statut sera "Brouillon" après la création.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
