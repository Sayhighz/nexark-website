import clsx from "clsx"

export default function SpeechIsolation({ className, style }) {
  return (
    <div 
      className={clsx(
        "rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <div className="mb-4 flex items-center space-x-3">
        <div className="rounded-lg bg-orange-500/20 p-2">
          <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Speech Isolation</h3>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        AI-powered vocal isolation separates speech from background music and ambient sounds, perfect for podcasts, interviews, and voice-overs.
      </p>
      <div className="mt-4 flex items-center space-x-2">
        <div className="h-2 flex-1 rounded-full bg-white/10">
          <div className="h-2 w-11/12 rounded-full bg-gradient-to-r from-orange-500 to-red-400"></div>
        </div>
        <span className="text-xs text-white/60">92% isolated</span>
      </div>
    </div>
  )
}