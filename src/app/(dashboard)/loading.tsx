export default function Loading() {
    return (
        <div
            className="vr-splash min-h-screen flex flex-col items-center justify-center gap-6"
            style={{ background: 'linear-gradient(160deg, #1B211B 0%, #2C3A2C 100%)' }}
        >
            <style>{`
                @keyframes vrFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .vr-splash {
                    opacity: 0;
                    animation: vrFadeIn 0.3s ease-out forwards;
                }
            `}</style>

            <div className="w-24 h-24 rounded-3xl bg-[#F6F5F1] flex items-center justify-center shadow-2xl animate-pulse">
                <img src="/icon-192.png" alt="Via Relatórios" className="w-16 h-16" />
            </div>
            <div className="w-24 h-0.5 bg-[#C2A24B] animate-pulse" />
            <p className="text-sm tracking-widest uppercase text-[#F6F5F1]/70">
                Carregando
            </p>
        </div>
    );
}