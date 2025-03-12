"use client"

import { useRef, useEffect } from "react"

export default function SpaceAnimation({ isAnimating }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const starsRef = useRef([])
  const galaxiesRef = useRef([])
  const planetsRef = useRef([])

  const initScene = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full viewport size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    starsRef.current = []
    galaxiesRef.current = []
    planetsRef.current = []

    // Initialize stars - optimized for mobile performance
    const starCount = window.innerWidth < 768 ? 500 : 1000
    for (let i = 0; i < starCount; i++) {
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

    // Initialize galaxies - fewer on mobile
    const galaxyCount = window.innerWidth < 768 ? 2 : 3
    for (let i = 0; i < galaxyCount; i++) {
      const galaxy = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 80 + Math.random() * 120,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
      }
      galaxiesRef.current.push(galaxy)
    }

    // Initialize planets - fewer on mobile
    const planetCount = window.innerWidth < 768 ? 1 : 2
    for (let i = 0; i < planetCount; i++) {
      const planet = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20 + Math.random() * 30,
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
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(planet.x, planet.y, planet.size + 3, 0, Math.PI * 2)
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

      // Enhanced trail effect - shorter on mobile for performance
      const tailLength = window.innerWidth < 768 ? (1 - star.z / canvas.width) * 20 : (1 - star.z / canvas.width) * 40

      ctx.beginPath()
      ctx.strokeStyle = star.color
      ctx.lineWidth = size / 2
      ctx.moveTo(x, y)
      ctx.lineTo(x - ((x - centerX) * tailLength) / 100, y - ((y - centerY) * tailLength) / 100)
      ctx.stroke()
    })

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animateSpace)
    }
  }

  useEffect(() => {
    if (isAnimating) {
      // Initialize and start animation when isAnimating becomes true
      initScene()
      animateSpace()
    } else {
      // Clean up animation when isAnimating becomes false
      cancelAnimationFrame(animationRef.current)
    }

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current && isAnimating) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        initScene()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [isAnimating])

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

