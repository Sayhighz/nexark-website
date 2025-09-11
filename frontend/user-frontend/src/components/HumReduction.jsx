import clsx from "clsx"

export default function HumReduction({ className, style }) {
  return (
    <div 
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-lg bg-purple-500/20 p-2">
          <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Hum Reduction</h3>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        Eliminate electrical hum and low-frequency interference from power lines, air conditioning, and other electronic devices for crystal-clear audio.
      </p>
      <div className="mt-4 flex items-center space-x-2">
        <div className="h-2 flex-1 rounded-full bg-white/10">
          <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"></div>
        </div>
        <span className="text-xs text-white/60">75% reduced</span>
      </div>
    </div>
  )
}