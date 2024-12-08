export function Hero() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-[60%]">
      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">
        <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
            key={i}
            className="w-3 h-3 rounded-full bg-zinc-700"
            />
          ))}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          ▲
          </div>
          {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 h-16 w-0.5 bg-gradient-to-b from-zinc-700"
            style={{
            transform: `rotate(${(i - 1) * 90}deg)`,
            transformOrigin: "bottom",
            }}
          />
          ))}
        </div>
        </div>
      </div>
      <div className="pl-6 pr-6">
        <h3 className="text-lg font-semibold">Unified Provider API</h3>
        <p className="text-sm text-zinc-400">
        Switch between AI providers by changing a single line of code.
        </p>
      </div>

      </div>
      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">
        <div className="max-w-[240px] mx-auto space-y-4">
        <div className="bg-zinc-800 rounded-lg p-4">
          <div className="space-y-2">
          <div className="text-sm font-medium">Blowin&apos; in the Wind</div>
          <div className="text-xs text-zinc-400">Bob Dylan</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          {/* <Music className="h-5 w-5 text-zinc-400" />
          <Settings2 className="h-5 w-5 text-zinc-400" /> */}
        </div>
        </div>
      </div>
      <div className="pl-6 pr-6">
        <h3 className="text-lg font-semibold">Generative UI</h3>
        <p className="text-sm text-zinc-400">
        Create dynamic, AI-powered user interfaces that amaze your users.
        </p>
      </div>

      </div>
      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">

      </div>
      <div className="pl-6 pr-6 pb-6">
        <h3 className="text-lg font-semibold">Framework-agnostic</h3>
        <p className="text-sm text-zinc-400">
        Build with React, Next, Vue, Nuxt, SvelteKit, and more.
        </p>
      </div>
      </div>

      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">
        <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
          key={i}
          className="h-2 bg-zinc-800 rounded"
          style={{ width: `${Math.random() * 50 + 50}%` }}
          />
        ))}
        </div>
      </div>
      <div className="pl-6 pr-6 pb-6">
        <h3 className="text-lg font-semibold">Streaming AI Responses</h3>
        <p className="text-sm text-zinc-400">
        Don&apos;t let your users wait for AI responses. Send them instantly.
        </p>
      </div>
      </div>

      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">
        <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
          key={i}
          className="h-2 bg-zinc-800 rounded"
          style={{ width: `${Math.random() * 50 + 50}%` }}
          />
        ))}
        </div>
      </div>
      <div className="pl-6 pr-6 pb-6">
        <h3 className="text-lg font-semibold">Streaming AI Responses</h3>
        <p className="text-sm text-zinc-400">
        Don&apos;t let your users wait for AI responses. Send them instantly.
        </p>
      </div>
      </div>

      <div className="bg-zinc-950 rounded-lg space-y-4">
      <div className="relative h-48 bg-black rounded-lg p-4">
        <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
          key={i}
          className="h-2 bg-zinc-800 rounded"
          style={{ width: `${Math.random() * 50 + 50}%` }}
          />
        ))}
        </div>
      </div>
      <div className="pl-6 pr-6 pb-6">
        <h3 className="text-lg font-semibold">Streaming AI Responses</h3>
        <p className="text-sm text-zinc-400">
        Don&apos;t let your users wait for AI responses. Send them instantly.
        </p>
      </div>
      </div>
    </div>
    
  );
}

