"use client"

import { useState } from "react"

export function BoxingMarketCard() {
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full max-w-sm font-mono">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-[#1a0a08] via-[#120604] to-[#0a0302] border border-[#3a1a15] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,100,50,0.15)]">
        {/* Header */}
        <div className="relative p-4 border-b border-[#3a1a15]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-[#ff3366] rounded text-[10px] tracking-widest text-white font-bold animate-pulse shadow-[0_0_20px_rgba(255,51,102,0.5)]">
                LIVE
              </div>
              <span className="text-[#8a6a60] text-xs">DEC 19</span>
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
              247K
            </div>
          </div>

          {/* Event title */}
          <div className="mt-3">
            <p className="text-[#6a4a40] text-[10px] tracking-[0.3em] uppercase">Netflix Boxing</p>
            <h2 className="text-2xl tracking-wider text-white mt-1 uppercase electric-rainbow">JUDGMENT DAY</h2>
          </div>
        </div>

        {/* VS Section */}
        <div className="relative p-4">
          {/* Neon line accent */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#00d9ff] to-transparent" />

          <div className="grid grid-cols-5 gap-2 items-center">
            {/* Fighter 1 - Jake Paul */}
            <div className="col-span-2">
              <button
                onClick={() => setSelected("jake")}
                className={`w-full p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                  selected === "jake"
                    ? "bg-[#00d9ff]/20 border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20 scale-105"
                    : "bg-[#0a0302]/50 border-[#3a1a15] hover:border-[#5a3a30]"
                }`}
              >
                <div className="text-center">
                  <p className="text-xl text-white tracking-wider uppercase glitch-hover">JAKE</p>
                  <p className="text-[#6a4a40] text-[10px] tracking-widest">12-1</p>
                  <div className="mt-2 py-1.5 px-2 bg-black/50 rounded-lg">
                    <span className="text-[#00d9ff] text-lg font-bold">+650</span>
                  </div>
                  <p className="text-[#5a3a30] text-[10px] mt-1">13% chance</p>
                </div>
              </button>
            </div>

            {/* VS */}
            <div className="col-span-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff6b35] blur-xl opacity-30" />
                <span className="relative text-2xl text-[#5a3a30] font-bold">VS</span>
              </div>
            </div>

            {/* Fighter 2 - AJ */}
            <div className="col-span-2">
              <button
                onClick={() => setSelected("aj")}
                className={`w-full p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                  selected === "aj"
                    ? "bg-[#ff006e]/20 border-[#ff006e] shadow-lg shadow-[#ff006e]/20 scale-105"
                    : "bg-[#0a0302]/50 border-[#3a1a15] hover:border-[#5a3a30]"
                }`}
              >
                <div className="text-center">
                  <p className="text-xl text-white tracking-wider uppercase glitch-hover">AJ</p>
                  <p className="text-[#6a4a40] text-[10px] tracking-widest">28-4</p>
                  <div className="mt-2 py-1.5 px-2 bg-black/50 rounded-lg">
                    <span className="text-[#ff006e] text-lg font-bold">-1100</span>
                  </div>
                  <p className="text-[#5a3a30] text-[10px] mt-1">87% chance</p>
                </div>
              </button>
            </div>
          </div>

          {/* Market stats bar */}
          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse" />
                <span className="text-[#6a4a40] text-[10px]">$2.4M Vol</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-[#6a4a40]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span className="text-[#6a4a40] text-[10px]">18.2K traders</span>
              </div>
            </div>
            <div className="text-[#5a3a30] text-[10px]">11d left</div>
          </div>
        </div>

        {/* Action footer */}
        <div className="p-4 pt-0">
          {selected ? (
            <div className="space-y-2">
              <button className="w-full py-3 psychedelic-gradient rounded-xl text-black text-sm tracking-widest transition-all transform hover:scale-[1.02] active:scale-[0.98] font-bold uppercase">
                Call It
              </button>
              <button
                onClick={handleCopy}
                className="w-full py-2.5 bg-[#0a0302] hover:bg-[#1a0a08] border border-[#3a1a15] rounded-xl text-[#8a6a60] text-xs tracking-widest transition-all flex items-center justify-center gap-2 uppercase"
              >
                {copied ? (
                  <>Copied</>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Top Caller
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-[#5a3a30] text-xs uppercase tracking-widest">Tap a side to call it</p>
            </div>
          )}
        </div>

        {/* Bottom brand */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-[#3a1a15] text-[10px] tracking-[0.2em] uppercase glitch-always">Renegade</span>
          <div className="flex items-center gap-2">
            <span className="text-[#3a1a15] text-[10px]">TRENDING #3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
