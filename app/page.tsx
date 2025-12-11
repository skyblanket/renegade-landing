"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SwipeableMarkets } from "@/components/swipeable-markets"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export default function Home() {
  const introSection = useInView(0.2)
  const statsSection = useInView(0.2)
  const ctaSection = useInView(0.3)
  const exampleSection = useInView(0.2)

  return (
    <div className="min-h-screen bg-[#180a08] text-foreground overflow-hidden font-mono">
      <nav className="fixed top-0 w-full z-50 mix-blend-difference animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-6 md:px-12">
          <span className="text-sm tracking-[0.3em] uppercase text-white glitch-always cursor-pointer">Renegade</span>
          <div className="flex items-center gap-8">
            <Link href="/fight" className="text-xs tracking-[0.2em] uppercase text-white cursor-pointer hover:text-primary transition-colors hover-lift">
              Enter
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col justify-end pb-12 md:pb-24">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full max-w-5xl">
            <Image
              src="/images/img-3916.jpg"
              alt="Renegade"
              fill
              className="object-contain object-center scale-125 mask-fade-hero animate-float"
              priority
            />

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#180a08] via-[#180a08]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#180a08] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#180a08] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#180a08] to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-12">
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-[0.85] tracking-[-0.02em] uppercase">
            <span
              className="block text-foreground/90 animate-fade-in-up opacity-0 delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              Predict
            </span>
            <span
              className="block electric-rainbow animate-fade-in-up opacity-0 delay-500"
              style={{ animationFillMode: "forwards" }}
            >
              Everything
            </span>
          </h1>
        </div>

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up opacity-0 delay-700"
          style={{ animationFillMode: "forwards" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent animate-bounce-down" />
        </div>
      </section>

      <section ref={introSection.ref} className="relative py-24 md:py-32 px-6 md:px-12 bg-[#180a08]">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className={`text-xl md:text-3xl lg:text-4xl font-light leading-relaxed transition-all duration-1000 ${introSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <span className="block text-muted-foreground mb-2">A prediction market for the culture.</span>
            <span className="block text-foreground mb-2">Sports. Crypto. Politics. Chaos.</span>
            <span className="block gradient-text-smooth">Copy creators. Flex receipts. Prove you called it.</span>
          </p>
        </div>
      </section>


      <section ref={exampleSection.ref} className="relative py-32 md:py-48 px-6 md:px-12 bg-[#180a08]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div
              className={`transition-all duration-1000 ${exampleSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#6a4a40] mb-4">Live Markets</p>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 leading-[0.9]">
                Swipe.
                <br />
                <span className="electric-rainbow">Predict.</span>
                <br />
                Flex.
              </h3>
              <p className="text-[#8a6a60] text-lg leading-relaxed">
                Real-time prediction markets on everything that matters. From boxing to crypto to chaos — make your call
                and prove you saw it coming.
              </p>
            </div>

            <div
              className={`flex justify-center md:justify-end transition-all duration-1000 delay-300 ${exampleSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
            >
              <SwipeableMarkets />
            </div>
          </div>
        </div>
      </section>

      <section ref={statsSection.ref} className="relative py-24 md:py-32 px-6 md:px-12 border-t border-border/30 bg-[#180a08]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[200px] translate-x-1/2 -translate-y-1/2 animate-glow-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2 animate-glow-pulse" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div
            className={`text-center transition-all duration-700 delay-100 ${statsSection.isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text-smooth tracking-tight">$10B+</div>
            <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-4">Monthly Volume</div>
          </div>
          <div
            className={`text-center transition-all duration-700 delay-300 ${statsSection.isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">50K</div>
            <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-4">Creators</div>
          </div>
          <div
            className={`text-center transition-all duration-700 delay-500 ${statsSection.isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text-smooth tracking-tight">100M</div>
            <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground mt-4">Predictions Made</div>
          </div>
        </div>
      </section>

      <section ref={ctaSection.ref} className="relative py-32 md:py-48 px-6 md:px-12 bg-[#180a08]">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${ctaSection.isInView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight mb-8 leading-[0.9]">
            Ready to
            <br />
            <span className="gradient-text-smooth">call it?</span>
          </h2>

          <Link href="/fight">
            <Button
              size="lg"
              className="psychedelic-gradient text-background font-bold uppercase tracking-[0.2em] px-12 py-7 text-sm border-0 hover:scale-105 transition-transform duration-300 rounded-none magnetic-btn"
            >
              Enter Renegade <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/30 py-8 px-6 md:px-12 bg-[#180a08]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">&copy; 2025 Renegade</span>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors hover-lift"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors hover-lift"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors hover-lift"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
