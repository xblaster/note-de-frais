import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ExpenseForm from '../components/ExpenseForm';
import apiClient from '../api/api-client';

export default function CreateExpensePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData, status?: 'DRAFT' | 'SUBMITTED') => {
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('Utilisateur non connecté');

            // Add userId and status to formData
            formData.append('userId', userId);
            if (status) {
                formData.append('status', status);
            }

            await apiClient.post('/expenses', formData, {
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
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Téléchargez votre reçu pour un remplissage automatique par IA.
                    </p>
                </header>

                <ExpenseForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/dashboard')}
                    loading={loading}
                />

                {error && (
                    <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
