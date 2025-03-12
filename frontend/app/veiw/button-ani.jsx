"use client"

import { useState, useRef, useEffect } from "react"

export default function SpaceClaimButton() {
  const [animating, setAnimating] = useState(false)
  const canvasRef = useRef(null)
  const buttonRef = useRef(null)
  const animationRef = useRef(0)
  const starsRef = useRef([])
  const galaxiesRef = useRef([])
  const planetsRef = useRef([])

  const handleClaimtwo = () => {
    if (animating) return
    setAnimating(true)

    if (canvasRef.current) {
      canvasRef.current.style.opacity = "1"
      initScene()
      animateSpace()

      setTimeout(() => {
        setAnimating(false)
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "0"
        }
        cancelAnimationFrame(animationRef.current)
      }, 3000)
    }
  }

  const initScene = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    starsRef.current = []
    galaxiesRef.current = []
    planetsRef.current = []

    // Initialize stars
    for (let i = 0; i < 1000; i++) {
      const star = {
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        size: 0.5 + Math.random() * 1,
        speed: 5 + Math.random() * 10,
        color: `hsl(${Math.random() * 60 + 200}, 100%, ${70 + Math.random() * 30}%)`,
      }
      starsRef.current.push(star)
    }

    // Initialize galaxies
    for (let i = 0; i < 3; i++) {
      const galaxy = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 100 + Math.random() * 200,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
      }
      galaxiesRef.current.push(galaxy)
    }

    // Initialize planets
    for (let i = 0; i < 2; i++) {
      const planet = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 30 + Math.random() * 50,
        speed: 0.5 + Math.random() * 1,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }
      planetsRef.current.push(planet)
    }
  }

  const drawGalaxy = (ctx, galaxy) => {
    ctx.save()
    ctx.translate(galaxy.x, galaxy.y)
    ctx.rotate(galaxy.rotation)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size)
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
    gradient.addColorStop(0.2, "rgba(100, 100, 255, 0.6)")
    gradient.addColorStop(0.4, "rgba(50, 50, 150, 0.4)")
    gradient.addColorStop(1, "rgba(0, 0, 50, 0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, galaxy.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  const drawPlanet = (ctx, planet) => {
    ctx.fillStyle = planet.color
    ctx.beginPath()
    ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)
    ctx.fill()

    // Add a simple atmosphere effect
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(planet.x, planet.y, planet.size + 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  const animateSpace = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw and update galaxies
    galaxiesRef.current.forEach((galaxy) => {
      galaxy.rotation += 0.001
      drawGalaxy(ctx, galaxy)
    })

    // Draw and update planets
    planetsRef.current.forEach((planet) => {
      planet.x += planet.speed
      if (planet.x > canvas.width + planet.size) planet.x = -planet.size
      drawPlanet(ctx, planet)
    })

    // Draw and update stars
    starsRef.current.forEach((star) => {
      star.z -= star.speed

      if (star.z <= 0) {
        star.z = canvas.width
        star.x = Math.random() * canvas.width - centerX
        star.y = Math.random() * canvas.height - centerY
      }

      const factor = 200 / star.z
      const x = star.x * factor + centerX
      const y = star.y * factor + centerY

      const size = star.size * factor

      ctx.beginPath()
      ctx.fillStyle = star.color
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // Enhanced trail effect
      const tailLength = (1 - star.z / canvas.width) * 40
      ctx.beginPath()
      ctx.strokeStyle = star.color
      ctx.lineWidth = size / 2
      ctx.moveTo(x, y)
      ctx.lineTo(x - ((x - centerX) * tailLength) / 100, y - ((y - centerY) * tailLength) / 100)
      ctx.stroke()
    })

    if (animating) {
      animationRef.current = requestAnimationFrame(animateSpace)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const updateCanvasSize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth
          canvasRef.current.height = window.innerHeight
        }
      }

      updateCanvasSize()
      window.addEventListener("resize", updateCanvasSize)

      return () => {
        window.removeEventListener("resize", updateCanvasSize)
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
      />

      <button
        ref={buttonRef}
        onClick={handleClaimtwo}
        disabled={animating}
        className={`
          relative z-20 px-8 py-3 text-lg font-bold text-white rounded-full
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-500 hover:to-purple-500
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          transform transition-all duration-200
          ${animating ? "scale-105 opacity-80" : "scale-100 opacity-100"}
        `}
      >
        {animating ? "Claiming..." : "Claim"}

        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-md" />

        {animating && (
          <span className="absolute inset-0 flex items-center justify-center">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white animate-ping"
                style={{
                  left: `${50 + Math.cos((i * Math.PI) / 3) * 20}%`,
                  top: `${50 + Math.sin((i * Math.PI) / 3) * 20}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </span>
        )}
      </button>
    </div>
  )
}

