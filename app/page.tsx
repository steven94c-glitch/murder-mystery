import Link from 'next/link';
import { CHARACTERS, GAME_TITLE } from '@/lib/game-data';

export default function HomePage() {
  const required = CHARACTERS.filter((c) => !c.isOptional && !c.isVictim);
  const optional = CHARACTERS.filter((c) => c.isOptional);

  return (
    <main className="min-h-screen bg-atmosphere flex flex-col items-center justify-center py-12 px-4 relative">
      {/* Atmospheric rain */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 select-none z-0" aria-hidden>
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"
            style={{
              left: `${(i * 4.2) % 100}%`,
              height: `${80 + (i * 19) % 50}px`,
              animation: `rain-drop ${1.5 + (i * 0.18) % 1.2}s linear infinite`,
              animationDelay: `${(i * 0.27) % 2.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title section */}
        <div className="text-center mb-16">
          <div className="mb-6 text-6xl drop-shadow-lg">🏚️</div>

          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-3" style={{ color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
              Sand, Secrets
              <br />
              <span style={{ color: '#8b1a1a' }}>&amp; Sorrow</span>
            </h1>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-lg italic" style={{ color: '#f0ead6', fontFamily: "'Cormorant', serif" }}>
              A Cape May Mystery
            </p>
            <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase" style={{ color: '#c9a84c' }}>
              <span>Grammy&apos;s Beach House</span>
              <span className="w-1 h-1 rounded-full bg-current"></span>
              <span>Memorial Day Weekend</span>
              <span className="w-1 h-1 rounded-full bg-current"></span>
              <span>Cape May, NJ</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t separator-gold">
            <p className="text-sm italic" style={{ color: '#2d7a6e' }}>
              ☁️ The rain hammers against the windows of the grand Victorian estate...
            </p>
          </div>
        </div>

        {/* Character Grid */}
        <div className="mb-12">
          <h2 className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: '#c9a84c' }}>
            📋 Choose Your Character
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {required.map((char) => (
              <Link
                key={char.name}
                href={`/play/${char.name.toLowerCase()}`}
                className="character-card p-5 flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {char.emoji}
                </div>
                <div className="text-center flex-1">
                  <p className="font-bold text-sm mb-1" style={{ color: '#d4af37' }}>
                    {char.name}
                  </p>
                  <p className="text-xs" style={{ color: '#a0a0a0' }}>
                    {char.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Optional Characters */}
        {optional.length > 0 && (
          <div className="mb-12 pb-8 border-b separator-gold">
            <h2 className="text-center text-xs uppercase tracking-widest mb-4" style={{ color: '#808080' }}>
              ✦ If you&apos;re here, tap your name
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {optional.map((char) => (
                <Link
                  key={char.name}
                  href={`/play/${char.name.toLowerCase()}`}
                  className="p-4 flex flex-col items-center gap-2 rounded-sm border transition-all duration-200 cursor-pointer opacity-70 hover:opacity-100 group"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}
                >
                  <div className="text-3xl group-hover:scale-105 transition-transform">
                    {char.emoji}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs mb-1" style={{ color: '#c9a84c' }}>
                      {char.name}
                    </p>
                    <p className="text-xs" style={{ color: '#707070' }}>
                      {char.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Host Link - Prominent but Secret */}
        <div className="flex justify-center">
          <Link
            href="/host"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer rounded-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(92, 46, 46, 0.2) 0%, rgba(139, 26, 26, 0.15) 100%)',
              border: '1px solid rgba(139, 26, 26, 0.3)',
              color: '#d4a574',
            }}
          >
            📺 Host Screen
          </Link>
        </div>

        {/* Footer instructions */}
        <div className="mt-12 pt-8 border-t separator-gold text-center">
          <p className="text-xs" style={{ color: '#707070' }}>
            All characters gather in the living room · Keep your phone hidden from other players
          </p>
        </div>
      </div>
    </main>
  );
}
