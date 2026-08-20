'use client';

import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, X, GripVertical, Edit2, Check } from 'lucide-react';
import { comprimirImagem } from '@/lib/comprimirImagem';
import { uploadFoto } from '@/app/(dashboard)/vistoria/actions/fotos/uploadFoto';
import { removerFoto } from '@/app/(dashboard)/vistoria/actions/fotos/removerFoto';
import { atualizarLegenda } from '@/app/(dashboard)/vistoria/actions/fotos/atualizarLegenda';
import { reordenarFotos } from '@/app/(dashboard)/vistoria/actions/fotos/reordenarFotos';

interface Foto {
    id: string;
    url: string;
    legenda: string | null;
    ordem: number;
}

interface GaleriaFotosProps {
    comodoId: string;
    vistoriaId: string;
    fotos: Foto[];
    modo: 'leitura' | 'edicao';
    onFotosChange?: (fotos: Foto[]) => void;
}

export default function GaleriaFotos({ comodoId, vistoriaId, fotos, modo, onFotosChange }: GaleriaFotosProps) {
    const [fotosLista, setFotosLista] = useState(fotos);
    const [uploadando, setUploading] = useState(false);
    const [fotoAmpliada, setFotoAmpliada] = useState<Foto | null>(null);
    const [editandoLegenda, setEditandoLegenda] = useState<string | null>(null);
    const [legendaTemp, setLegendaTemp] = useState('');
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [erro, setErro] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    async function handleUpload(files: FileList | null) {
        if (!files || files.length === 0) return;

        setUploading(true);
        setErro('');

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Comprimir a imagem
                const blob = await comprimirImagem(file);
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });

                const formData = new FormData();
                formData.append('comodo_id', comodoId);
                formData.append('vistoria_id', vistoriaId);
                formData.append('foto', compressedFile);

                const resultado = await uploadFoto(formData);

                if (resultado?.error) {
                    setErro(resultado.error);
                    break;
                }

                if (resultado?.url) {
                    const novaFoto: Foto = {
                        id: `temp-${Date.now()}-${i}`,
                        url: resultado.url,
                        legenda: null,
                        ordem: fotosLista.length + i,
                    };
                    setFotosLista((prev) => [...prev, novaFoto]);
                }
            }

            // Recarregar a página para buscar as fotos reais com IDs corretos
            window.location.reload();
        } catch (err: any) {
            setErro(err.message || 'Erro ao fazer upload.');
        } finally {
            setUploading(false);
        }
    }

    async function handleRemover(fotoId: string) {
        if (!window.confirm('Tem certeza que deseja remover esta foto?')) return;

        const resultado = await removerFoto(fotoId);
        if (resultado?.error) {
            setErro(resultado.error);
        } else {
            setFotosLista((prev) => prev.filter((f) => f.id !== fotoId));
            onFotosChange?.(fotosLista.filter((f) => f.id !== fotoId));
        }
    }

    async function handleSalvarLegenda(fotoId: string) {
        const resultado = await atualizarLegenda(fotoId, legendaTemp);
        if (resultado?.error) {
            setErro(resultado.error);
        } else {
            setFotosLista((prev) =>
                prev.map((f) => (f.id === fotoId ? { ...f, legenda: legendaTemp } : f))
            );
            onFotosChange?.(
                fotosLista.map((f) => (f.id === fotoId ? { ...f, legenda: legendaTemp } : f))
            );
        }
        setEditandoLegenda(null);
        setLegendaTemp('');
    }

    function handleDragStart(e: React.DragEvent, fotoId: string) {
        setDraggedId(fotoId);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e: React.DragEvent, targetId: string) {
        e.preventDefault();
        if (draggedId === null || draggedId === targetId) return;

        setFotosLista((prev) => {
            const draggedIndex = prev.findIndex((f) => f.id === draggedId);
            const targetIndex = prev.findIndex((f) => f.id === targetId);
            if (draggedIndex === -1 || targetIndex === -1) return prev;

            const novaLista = [...prev];
            const [draggedItem] = novaLista.splice(draggedIndex, 1);
            novaLista.splice(targetIndex, 0, draggedItem);
            return novaLista;
        });
    }

    async function handleDragEnd() {
        if (draggedId === null) return;

        const ordemIds = fotosLista.map((f) => f.id);
        const resultado = await reordenarFotos(comodoId, ordemIds);
        if (resultado?.error) {
            setErro(resultado.error);
            setFotosLista(fotos); // Reverte
        }

        setDraggedId(null);
    }

    return (
        <div className="mt-4">
            {erro && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {erro}
                </div>
            )}

            {/* Galeria horizontal */}
            {fotosLista.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-3 mb-3">
                    {fotosLista.map((foto) => (
                        <div
                            key={foto.id}
                            draggable={modo === 'edicao'}
                            onDragStart={(e) => handleDragStart(e, foto.id)}
                            onDragOver={(e) => handleDragOver(e, foto.id)}
                            onDragEnd={handleDragEnd}
                            className="flex-shrink-0 w-40 rounded-lg border-2 overflow-hidden relative group"
                            style={{
                                backgroundColor: 'var(--surface)',
                                borderColor: draggedId === foto.id ? 'var(--primary)' : 'var(--border)',
                            }}
                        >
                            {/* Handle de drag (só no modo edição) */}
                            {modo === 'edicao' && (
                                <div className="absolute top-1 left-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                                </div>
                            )}

                            {/* Imagem */}
                            <img
                                src={foto.url}
                                alt={foto.legenda || 'Foto do cômodo'}
                                className="w-full h-32 object-cover cursor-pointer"
                                onClick={() => setFotoAmpliada(foto)}
                            />

                            {/* Botão remover (só no modo edição) */}
                            {modo === 'edicao' && (
                                <button
                                    type="button"
                                    onClick={() => handleRemover(foto.id)}
                                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}

                            {/* Legenda */}
                            {modo === 'edicao' ? (
                                editandoLegenda === foto.id ? (
                                    <div className="p-2 flex gap-1">
                                        <input
                                            type="text"
                                            value={legendaTemp}
                                            onChange={(e) => setLegendaTemp(e.target.value)}
                                            className="flex-1 text-xs p-1 border rounded"
                                            placeholder="Legenda..."
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleSalvarLegenda(foto.id)}
                                            className="p-1 text-green-600"
                                        >
                                            <Check size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="p-2 cursor-pointer hover:bg-gray-50"
                                        onClick={() => {
                                            setEditandoLegenda(foto.id);
                                            setLegendaTemp(foto.legenda || '');
                                        }}
                                    >
                                        {foto.legenda ? (
                                            <p className="text-xs line-clamp-2" style={{ color: 'var(--text)' }}>
                                                {foto.legenda}
                                            </p>
                                        ) : (
                                            <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                                                Clique para adicionar legenda
                                            </p>
                                        )}
                                    </div>
                                )
                            ) : (
                                foto.legenda && (
                                    <div className="p-2">
                                        <p className="text-xs" style={{ color: 'var(--text)' }}>
                                            {foto.legenda}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Botões de adicionar (só no modo edição) */}
            {modo === 'edicao' && (
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={uploadando}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 disabled:opacity-50"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        <Camera size={16} />
                        {uploadando ? 'Enviando...' : 'Tirar Foto'}
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadando}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 disabled:opacity-50"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    >
                        <ImageIcon size={16} />
                        Escolher da Galeria
                    </button>

                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleUpload(e.target.files)}
                        className="hidden"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleUpload(e.target.files)}
                        className="hidden"
                    />
                </div>
            )}

            {/* Modal de tela cheia */}
            {fotoAmpliada && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setFotoAmpliada(null)}
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 text-white"
                        onClick={() => setFotoAmpliada(null)}
                    >
                        <X size={24} />
                    </button>
                    <div className="max-w-5xl max-h-full">
                        <img src={fotoAmpliada.url} alt={fotoAmpliada.legenda || 'Foto ampliada'} className="max-w-full max-h-full object-contain" />
                        {fotoAmpliada.legenda && (
                            <p className="text-white text-center mt-4">{fotoAmpliada.legenda}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}