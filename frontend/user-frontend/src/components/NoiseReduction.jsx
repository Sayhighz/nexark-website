import clsx from "clsx"

export default function NoiseReduction({ className, style }) {
  return (
    <div 
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-lg bg-blue-500/20 p-2">
          <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Noise Reduction</h3>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        Advanced AI-powered noise reduction removes background noise, hiss, and unwanted artifacts while preserving the clarity of your main audio content.
      </p>
      <div className="mt-4 flex items-center space-x-2">
        <div className="h-2 flex-1 rounded-full bg-white/10">
          <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
        </div>
        <span className="text-xs text-white/60">80% cleaner</span>
      </div>
    </div>
  )
}