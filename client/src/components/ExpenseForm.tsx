import { useState, useEffect } from 'react';
import { Send, Euro, Building, Calendar, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReceiptCapture from './ReceiptCapture';
import apiClient from '../api/api-client';

interface ExpenseFormProps {
    initialData?: {
        id?: string;
        amount: string;
        date: string;
        vendor: string;
        screenshotUrl?: string;
    };
    onSubmit: (data: FormData, status?: 'DRAFT' | 'SUBMITTED') => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
    loading?: boolean;
}

export default function ExpenseForm({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = 'Soumettre',
    loading = false,
}: ExpenseFormProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        amount: initialData?.amount || '',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        vendor: initialData?.vendor || '',
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [lastAnalyzedFile, setLastAnalyzedFile] = useState<File | null>(null);

    useEffect(() => {
        if (receiptFile && receiptFile !== lastAnalyzedFile) {
            handleAnalyze(receiptFile);
        }
    }, [receiptFile]);

    const handleAnalyze = async (file: File) => {
        setIsAnalyzing(true);
        setError(null);
        setLastAnalyzedFile(file);

        try {
            const data = new FormData();
            data.append('receipt', file);

            const response = await apiClient.post('/expenses/analyze', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { amount, vendor, date } = response.data;

            setFormData(prev => ({
                ...prev,
                amount: amount?.toString() || prev.amount,
                vendor: vendor || prev.vendor,
                date: date || prev.date,
            }));
        } catch (err: any) {
            console.error('Failed to analyze receipt:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAction = async (status: 'DRAFT' | 'SUBMITTED') => {
        if (!formData.amount || !formData.date) {
            setError('Le montant et la date sont requis.');
            return;
        }

        setError(null);

        const data = new FormData();
        data.append('amount', formData.amount);
        data.append('date', formData.date);
        data.append('vendor', formData.vendor);
        if (receiptFile) {
            data.append('receipt', receiptFile);
        }

        await onSubmit(data, status);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Default to SUBMITTED when pressing enter on the form
        await handleAction('SUBMITTED');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Capture Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-12 xl:col-span-5 order-first lg:order-last space-y-6"
            >
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-foreground">Analyse IA en cours...</p>
                                <p className="text-xs text-muted-foreground">Extraction des données du reçu</p>
                            </div>
                        </div>
                    )}
                    <ReceiptCapture
                        onCapture={setReceiptFile}
                        initialPreview={initialData?.screenshotUrl ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${initialData.screenshotUrl}` : undefined}
                    />
                </div>

                {!receiptFile && !initialData?.screenshotUrl && (
                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                        <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Analyse Intelligente
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Notre IA extrait automatiquement le marchand, le montant et la date de votre reçu.
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-12 xl:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/20"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2 flex justify-between items-center">
                                <span>Montant</span>
                                {isAnalyzing && <span className="text-[10px] text-primary animate-pulse flex items-center gap-1"><RefreshCw className="w-2 h-2 animate-spin" /> Détection...</span>}
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
                                    className={`w-full bg-input border rounded-xl pl-10 pr-4 py-3 text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all ${isAnalyzing ? 'opacity-50' : 'border-border'}`}
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
                                    className={`w-full bg-input border rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all ${isAnalyzing ? 'opacity-50' : 'border-border'}`}
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
                                    className={`w-full bg-input border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all ${isAnalyzing ? 'opacity-50' : 'border-border'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted/10 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            disabled={loading || isAnalyzing}
                            onClick={() => handleAction('DRAFT')}
                            className="flex-1 px-6 py-3 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Brouillon
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            disabled={loading || isAnalyzing}
                            onClick={() => handleAction('SUBMITTED')}
                            className="flex-[1.5] px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                        >
                            {loading ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>{submitLabel}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
