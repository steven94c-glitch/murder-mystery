import Link from 'next/link';
import { CHARACTERS, GAME_TITLE } from '@/lib/game-data';

export default function HomePage() {
  const required = CHARACTERS.filter((c) => !c.isOptional && !c.isVictim);
  const optional = CHARACTERS.filter((c) => c.isOptional);

  return (
    <main className="min-h-screen bg-atmosphere flex flex-col items-center py-10 px-4">
      {/* Rain overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 select-none" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent"
            style={{
              left: `${(i * 5.1) % 100}%`,
              height: `${60 + (i * 17) % 40}px`,
              animation: `rain-drop ${1.2 + (i * 0.15) % 1}s linear infinite`,
              animationDelay: `${(i * 0.23) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="text-5xl mb-4">🏖️</div>
        <h1
          className="text-4xl font-serif font-bold mb-2"
          style={{ color: '#c9a84c' }}
        >
          Sand, Secrets &amp; Sorrow
        </h1>
        <p className="text-xl text-gray-300 font-serif italic mb-1">
          A Cape May Mystery
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Grammy&apos;s Beach House &nbsp;·&nbsp; Memorial Day Weekend &nbsp;·&nbsp; Cape May, NJ
        </p>
        <div className="mt-4 text-xs text-gray-600 italic">
          ☁️ The rain hammers against the windows...
        </div>
      </div>

      {/* Character Cards */}
      <div className="w-full max-w-2xl relative z-10 mb-8">
        <h2 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-4">
          Choose Your Character
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {required.map((char) => (
            <Link
              key={char.name}
              href={`/play/${char.name.toLowerCase()}`}
              className="card-dark p-4 flex flex-col items-center gap-2 hover:border-yellow-500 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="text-3xl">{char.emoji}</span>
              <span className="font-bold text-sm text-center" style={{ color: '#c9a84c' }}>
                {char.name}
              </span>
              <span className="text-xs text-gray-400 text-center">{char.role}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Optional Characters */}
      {optional.length > 0 && (
        <div className="w-full max-w-2xl relative z-10 mb-10">
          <h2 className="text-center text-xs uppercase tracking-widest text-gray-500 mb-3">
            If you&apos;re here, tap your name
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {optional.map((char) => (
              <Link
                key={char.name}
                href={`/play/${char.name.toLowerCase()}`}
                className="p-3 flex flex-col items-center gap-1 border border-gray-700 rounded-xl hover:border-gray-500 transition-all duration-200 cursor-pointer opacity-75 hover:opacity-100"
              >
                <span className="text-2xl">{char.emoji}</span>
                <span className="font-bold text-sm text-center text-gray-300">
                  {char.name}
                </span>
                <span className="text-xs text-gray-500 text-center">{char.role}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Host Link */}
      <div className="relative z-10 mt-4">
        <Link
          href="/host"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(139, 26, 26, 0.3)',
            border: '1px solid rgba(176, 34, 34, 0.5)',
            color: '#e08080',
          }}
        >
          📺 Host Screen →
        </Link>
      </div>

      <div className="mt-10 text-center text-xs text-gray-700 relative z-10">
        All characters meet in the living room &nbsp;·&nbsp; Keep your phone hidden from other players
      </div>
    </main>
  );
}
