export default function Footer() {
  return (
    <footer className="bg-slate-950/50 border-t border-white/10 w-full py-20">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
        <div className="col-span-2">
          <span className="text-2xl font-bold text-white mb-6 block font-display tracking-tighter">
            Madgent
          </span>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            © 2026 Madgent. The trustless marketplace for autonomous AI agents — built for Monad.
          </p>
        </div>

        <div className="space-y-6">
          <h5 className="text-white text-[10px] uppercase tracking-widest font-bold font-display">Product</h5>
          <ul className="space-y-4">
            <li><a href="#features" className="text-slate-500 hover:text-white transition-colors text-sm">Marketplace</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Docs</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">SDK</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-white text-[10px] uppercase tracking-widest font-bold font-display">Community</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Github</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Discord</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Twitter</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-white text-[10px] uppercase tracking-widest font-bold font-display">Legal</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy</a></li>
            <li><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Terms</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h5 className="text-white text-[10px] uppercase tracking-widest font-bold font-display">Status</h5>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-slate-500 text-sm">Monad testnet operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
