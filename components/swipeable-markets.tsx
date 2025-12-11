"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowRight, Lock } from "lucide-react"

const MARKETS = [
  {
    id: 1,
    type: "boxing",
    league: "Netflix Boxing",
    title: "JUDGMENT DAY",
    date: "DEC 19",
    fighter1: { name: "JAKE", record: "12-1", odds: "+650", chance: "13%" },
    fighter2: { name: "AJ", record: "28-4", odds: "-1100", chance: "87%" },
    volume: "$2.4M",
    traders: "18.2K",
    timeLeft: "11d",
    trending: 3,
  },
  {
    id: 2,
    type: "boxing",
    league: "UFC 310",
    title: "PANTOJA VS ASAKURA",
    date: "DEC 7",
    fighter1: { name: "PANTOJA", record: "28-5", odds: "-350", chance: "78%" },
    fighter2: { name: "ASAKURA", record: "21-4", odds: "+280", chance: "22%" },
    volume: "$1.8M",
    traders: "12.4K",
    timeLeft: "2d",
    trending: 1,
  },
  {
    id: 3,
    type: "boxing",
    league: "Crypto",
    title: "BTC $150K BY JAN",
    date: "JAN 31",
    fighter1: { name: "YES", record: "", odds: "+180", chance: "36%" },
    fighter2: { name: "NO", record: "", odds: "-220", chance: "64%" },
    volume: "$8.2M",
    traders: "45.1K",
    timeLeft: "54d",
    trending: 2,
  },
]

export function SwipeableMarkets() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalSlides = MARKETS.length + 1 // +1 for waitlist card

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setDragStart(clientX)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null) return
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStart
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (dragStart === null) return

    const threshold = 80
    if (dragOffset < -threshold && currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }

    setDragStart(null)
    setDragOffset(0)
  }

  const isWaitlistCard = currentIndex === MARKETS.length

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? i === MARKETS.length
                  ? "w-8 psychedelic-gradient"
                  : "w-8 bg-[#00d9ff]"
                : "w-2 bg-[#3a1a15] hover:bg-[#5a3a30]"
            }`}
          />
        ))}
      </div>

      {/* Swipe container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {/* Market cards */}
          {MARKETS.map((market) => (
            <div key={market.id} className="w-full flex-shrink-0 px-2">
              <MarketCard market={market} />
            </div>
          ))}

          {/* Waitlist cliffhanger card */}
          <div className="w-full flex-shrink-0 px-2">
            <WaitlistCard />
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="flex justify-center mt-6">
        <p className="text-[#5a3a30] text-[10px] uppercase tracking-[0.3em] animate-pulse">
          {isWaitlistCard ? "Join to unlock all markets" : "Swipe to explore"}
        </p>
      </div>
    </div>
  )
}

function MarketCard({ market }: { market: (typeof MARKETS)[0] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="relative w-full font-mono select-none">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative bg-gradient-to-br from-[#1a0a08] via-[#120604] to-[#0a0302] border border-[#3a1a15] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,100,50,0.15)]">
        {/* Header */}
        <div className="relative p-4 border-b border-[#3a1a15]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-[#ff3366] rounded text-[10px] tracking-widest text-white font-bold animate-pulse shadow-[0_0_20px_rgba(255,51,102,0.5)]">
                LIVE
              </div>
              <span className="text-[#8a6a60] text-xs">{market.date}</span>
            </div>
            <div className="flex items-center gap-1 text-[#8a6a60] text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {market.traders}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[#6a4a40] text-[10px] tracking-[0.3em] uppercase">{market.league}</p>
            <h2 className="text-xl tracking-wider text-white mt-1 uppercase electric-rainbow">{market.title}</h2>
          </div>
        </div>

        {/* VS Section */}
        <div className="relative p-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#00d9ff] to-transparent" />

          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <button
                onClick={() => setSelected("fighter1")}
                className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                  selected === "fighter1"
                    ? "bg-[#00d9ff]/20 border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20 scale-105"
                    : "bg-[#0a0302]/50 border-[#3a1a15]"
                }`}
              >
                <div className="text-center">
                  <p className="text-lg text-white tracking-wider uppercase">{market.fighter1.name}</p>
                  {market.fighter1.record && (
                    <p className="text-[#6a4a40] text-[10px] tracking-widest">{market.fighter1.record}</p>
                  )}
                  <div className="mt-2 py-1.5 px-2 bg-black/50 rounded-lg">
                    <span className="text-[#00d9ff] text-lg font-bold">{market.fighter1.odds}</span>
                  </div>
                  <p className="text-[#5a3a30] text-[10px] mt-1">{market.fighter1.chance} chance</p>
                </div>
              </button>
            </div>

            <div className="col-span-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff6b35] blur-xl opacity-30" />
                <span className="relative text-xl text-[#5a3a30] font-bold">VS</span>
              </div>
            </div>

            <div className="col-span-2">
              <button
                onClick={() => setSelected("fighter2")}
                className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                  selected === "fighter2"
                    ? "bg-[#ff006e]/20 border-[#ff006e] shadow-lg shadow-[#ff006e]/20 scale-105"
                    : "bg-[#0a0302]/50 border-[#3a1a15]"
                }`}
              >
                <div className="text-center">
                  <p className="text-lg text-white tracking-wider uppercase">{market.fighter2.name}</p>
                  {market.fighter2.record && (
                    <p className="text-[#6a4a40] text-[10px] tracking-widest">{market.fighter2.record}</p>
                  )}
                  <div className="mt-2 py-1.5 px-2 bg-black/50 rounded-lg">
                    <span className="text-[#ff006e] text-lg font-bold">{market.fighter2.odds}</span>
                  </div>
                  <p className="text-[#5a3a30] text-[10px] mt-1">{market.fighter2.chance} chance</p>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse" />
                <span className="text-[#6a4a40] text-[10px]">{market.volume} Vol</span>
              </div>
            </div>
            <div className="text-[#5a3a30] text-[10px]">{market.timeLeft} left</div>
          </div>
        </div>

        <div className="p-4 pt-0">
          {selected ? (
            <button className="w-full py-3 psychedelic-gradient rounded-xl text-black text-sm tracking-widest font-bold uppercase">
              Call It
            </button>
          ) : (
            <div className="text-center py-2">
              <p className="text-[#5a3a30] text-xs uppercase tracking-widest">Tap a side to call it</p>
            </div>
          )}
        </div>

        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-[#3a1a15] text-[10px] tracking-[0.2em] uppercase glitch-always">Renegade</span>
          <span className="text-[#3a1a15] text-[10px]">TRENDING #{market.trending}</span>
        </div>
      </div>
    </div>
  )
}

function WaitlistCard() {
  const [email, setEmail] = useState("")

  return (
    <div className="relative w-full font-mono select-none">
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative bg-gradient-to-br from-[#1a0a08] via-[#120604] to-[#0a0302] border border-[#3a1a15] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,100,50,0.15)]">
        {/* Locked overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0302]/90 pointer-events-none" />

        {/* Blurred preview cards behind */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm">
          <div className="text-center">
            <p className="text-6xl">🔒</p>
          </div>
        </div>

        <div className="relative p-6 flex flex-col items-center justify-center min-h-[400px]">
          {/* Lock icon with glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 psychedelic-gradient blur-2xl opacity-50 scale-150" />
            <div className="relative w-16 h-16 rounded-full bg-[#0a0302] border border-[#3a1a15] flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#8a6a60]" />
            </div>
          </div>

          <h3 className="text-2xl font-bold uppercase tracking-wider text-center mb-2 electric-rainbow">
            50+ More Markets
          </h3>

          <p className="text-[#6a4a40] text-sm text-center mb-6 max-w-[250px]">
            Sports, crypto, politics, chaos — join the waitlist to unlock everything
          </p>

          {/* Stats teaser */}
          <div className="flex gap-6 mb-6">
            <div className="text-center">
              <p className="text-xl font-bold text-white">$10B+</p>
              <p className="text-[10px] text-[#5a3a30] tracking-widest uppercase">Volume</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">50K</p>
              <p className="text-[10px] text-[#5a3a30] tracking-widest uppercase">Creators</p>
            </div>
          </div>

          {/* Email input */}
          <div className="w-full space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-[#0a0302] border border-[#3a1a15] rounded-xl text-white text-sm placeholder:text-[#5a3a30] focus:outline-none focus:border-[#00d9ff] transition-colors font-mono"
            />
            <button className="w-full py-3 psychedelic-gradient rounded-xl text-black text-sm tracking-widest font-bold uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
              Join Waitlist <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#3a1a15] text-[10px] mt-4 tracking-widest uppercase">Early access • No spam • Be first</p>
        </div>

        <div className="px-4 pb-3 flex items-center justify-center">
          <span className="text-[#3a1a15] text-[10px] tracking-[0.2em] uppercase glitch-always">Renegade</span>
        </div>
      </div>
    </div>
  )
}
