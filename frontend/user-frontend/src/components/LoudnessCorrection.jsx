import clsx from "clsx"

export default function LoudnessCorrection({ className, style }) {
  return (
    <div 
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-lg bg-green-500/20 p-2">
          <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Loudness Correction</h3>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        Automatic level adjustment and dynamic range compression ensures consistent volume throughout your audio with professional broadcast standards.
      </p>
      <div className="mt-4 flex items-center space-x-2">
        <div className="h-2 flex-1 rounded-full bg-white/10">
          <div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>
        </div>
        <span className="text-xs text-white/60">85% balanced</span>
      </div>
    </div>
  )
}