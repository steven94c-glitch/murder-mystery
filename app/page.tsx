import Link from 'next/link';
import { CHARACTERS, GAME_TITLE } from '@/lib/game-data';

export default function HomePage() {
  const required = CHARACTERS.filter((c) => !c.isOptional && !c.isVictim);
  const optional = CHARACTERS.filter((c) => c.isOptional);

  return (
    <main className="min-h-screen bg-atmosphere flex flex-col items-center justify-center py-12 px-4 relative">
      {/* Vintage marquee lights animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '8px',
              height: '8px',
              left: `${(i * 12.5) % 100}%`,
              top: '10%',
              background: 'rgba(212, 175, 55, 0.6)',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.8)',
              animation: `marquee-blink ${0.5 + (i * 0.08)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.06)}s`,
            }}
          />
        ))}
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title section - Vintage Theater Marquee */}
        <div className="text-center mb-16">
          <div className="mb-8">
            {/* Ornate top border */}
            <div className="divider-marquee mb-8">
              <div />
              <span className="text-sm" style={{ color: 'rgba(212, 175, 55, 0.4)' }}>✦ ✦ ✦</span>
              <div />
            </div>

            {/* Main title - Art Deco style */}
            <h1 className="art-deco-title text-5xl md:text-6xl mb-6" style={{
              color: '#d4af37',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.3)',
              fontWeight: 700
            }}>
              Sand, Secrets
              <br />
              <span style={{ color: '#f4d03f', fontSize: '1.1em' }}>&amp; Sorrow</span>
            </h1>

            {/* Ornate bottom border */}
            <div className="divider-marquee mt-6 mb-8">
              <div />
              <span className="text-sm" style={{ color: 'rgba(212, 175, 55, 0.4)' }}>✦ ✦ ✦</span>
              <div />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-xl" style={{ color: '#f5ede0', fontFamily: "'Cormorant', serif", fontWeight: 500, letterSpacing: '0.08em' }}>
              A Cape May Mystery
            </p>
            <div className="flex flex-col items-center justify-center gap-3 text-xs tracking-widest uppercase" style={{ color: '#d4a574' }}>
              <div className="flex items-center gap-2">
                <span>Grammy&apos;s Beach House</span>
                <span className="w-1 h-1 rounded-full bg-current"></span>
                <span>Memorial Day Weekend</span>
              </div>
              <span style={{ color: '#8b5a3c' }}>Cape May, NJ</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t separator-gold">
            <p className="text-sm italic" style={{ color: '#c9a86a', fontFamily: "'Cormorant', serif" }}>
              ☁️ The rain hammers against the windows of the grand Victorian estate...
            </p>
          </div>
        </div>

        {/* Character Grid - Wanted Poster Style */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="divider-marquee">
              <div />
              <span className="divider-marquee-text">Cast of Characters</span>
              <div />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {required.map((char) => (
              <Link
                key={char.name}
                href={`/play/${char.name.toLowerCase()}`}
                className="character-card p-6 flex flex-col items-center gap-4 cursor-pointer group"
              >
                <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
                  {char.emoji}
                </div>
                <div className="text-center flex-1 w-full">
                  <p className="font-bold text-base mb-2" style={{ color: '#f4d03f', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                    {char.name}
                  </p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#d4a574', fontFamily: "'Cormorant', serif" }}>
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
            <h2 className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: '#8b5a3c', fontFamily: "'Bebas Neue', sans-serif" }}>
              ✦ Additional Guests
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {optional.map((char) => (
                <Link
                  key={char.name}
                  href={`/play/${char.name.toLowerCase()}`}
                  className="p-5 flex flex-col items-center gap-3 transition-all duration-200 cursor-pointer opacity-75 hover:opacity-100 group"
                  style={{
                    border: '2px solid rgba(212, 175, 55, 0.2)',
                    background: 'rgba(42, 42, 42, 0.5)',
                  }}
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {char.emoji}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xs mb-1" style={{ color: '#d4a574' }}>
                      {char.name}
                    </p>
                    <p className="text-xs uppercase tracking-widest" style={{ color: '#8b5a3c' }}>
                      {char.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Host Link - Theater Control Room Style */}
        <div className="flex justify-center mt-10">
          <Link
            href="/host"
            className="inline-flex items-center gap-3 px-10 py-5 font-bold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(107, 44, 44, 0.3) 0%, rgba(139, 26, 26, 0.2) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.35)',
              color: '#f4d03f',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(212, 175, 55, 0.15)',
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: '0.12em'
            }}
          >
            📺 Director&apos;s Booth
          </Link>
        </div>

        {/* Footer instructions */}
        <div className="mt-12 pt-8 border-t separator-gold text-center">
          <p className="text-xs" style={{ color: '#8b5a3c' }}>
            All characters gather in the living room · Keep your phone hidden from other players
          </p>
        </div>
      </div>
    </main>
  );
}
