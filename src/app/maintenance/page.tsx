import { Wrench, Clock } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-pulse"></div>
          </div>
          <div className="relative bg-slate-800 rounded-full p-6 border border-slate-700">
            <Wrench className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Under Maintenance
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-lg mb-8">
          We&apos;re currently performing scheduled maintenance to improve your experience.
        </p>

        {/* Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-3">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Expected Duration</span>
          </div>
          <p className="text-2xl font-bold text-white">~30 minutes</p>
        </div>

        {/* Footer */}
        <div className="space-y-3">
          <p className="text-slate-400 text-sm">
            We apologize for any inconvenience.
          </p>
          <p className="text-slate-500 text-xs">
            Please check back shortly. Thank you for your patience!
          </p>
        </div>

        {/* Decorative Snow Icon */}
        <div className="mt-12 flex justify-center gap-2 text-slate-600">
          <div className="text-2xl">❄️</div>
          <div className="text-xl">❄️</div>
          <div className="text-2xl">❄️</div>
        </div>
      </div>
    </div>
  );
}
