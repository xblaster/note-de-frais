import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptCaptureProps {
    onCapture: (file: File | null) => void;
    initialPreview?: string;
}

export default function ReceiptCapture({ onCapture, initialPreview }: ReceiptCaptureProps) {
    const [preview, setPreview] = useState<string | null>(initialPreview || null);

    useEffect(() => {
        if (initialPreview) {
            setPreview(initialPreview);
        }
    }, [initialPreview]);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
                setError(null);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
        }
    };

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'receipt.jpg', { type: 'image/jpeg' });
                        const url = URL.createObjectURL(blob);
                        setPreview(url);
                        onCapture(file);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.82);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Le fichier doit être une image (JPEG, PNG, WEBP).');
                return;
            }
            const url = URL.createObjectURL(file);
            setPreview(url);
            onCapture(file);
            setError(null);
        }
    };

    const clearCapture = () => {
        setPreview(null);
        onCapture(null);
        setError(null);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground mb-2">
                Justificatif (Photo ou Upload)
            </label>

            <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-border overflow-hidden bg-card/30 flex flex-col items-center justify-center transition-colors hover:border-primary/50">
                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <img src={preview} alt="Receipt preview" className="w-full h-full object-contain" />
                            <button
                                onClick={clearCapture}
                                className="absolute top-4 right-4 p-2 bg-error/80 hover:bg-error text-white rounded-full backdrop-blur-md transition-colors"
                                title="Supprimer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-success/20 border border-success/30 rounded-full backdrop-blur-md flex items-center gap-2 text-success text-sm font-medium">
                                <Check className="w-4 h-4" />
                                Justificatif prêt
                            </div>
                        </motion.div>
                    ) : isCameraActive ? (
                        <motion.div
                            key="camera"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black"
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 px-6">
                                <button
                                    onClick={stopCamera}
                                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={takePhoto}
                                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                >
                                    <div className="w-14 h-14 border-2 border-black rounded-full" />
                                </button>
                                <div className="w-12" /> {/* Spacer */}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 text-center"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex gap-4">
                                    <button
                                        onClick={startCamera}
                                        className="flex flex-col items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all hover:scale-105 border border-primary/20"
                                    >
                                        <Camera className="w-8 h-8" />
                                        <span className="text-sm font-medium">Caméra</span>
                                    </button>
                                    <label className="flex flex-col items-center gap-2 p-4 bg-muted/10 hover:bg-muted/20 text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer hover:scale-105 border border-border/50">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-sm font-medium">Fichier</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Prenez une photo de votre reçu ou glissez-déposez un fichier ici
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-error font-medium"
                >
                    {error}
                </motion.p>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
