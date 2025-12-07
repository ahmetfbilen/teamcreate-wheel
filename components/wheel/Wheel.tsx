"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface WheelProps {
    items: string[]
    onSpinEnd: (winner: string) => void
    isSpinning: boolean
}

export function Wheel({ items, onSpinEnd, isSpinning }: WheelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [rotation, setRotation] = useState(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const size = 500
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`

        const centerX = size / 2
        const centerY = size / 2
        const radius = size / 2 - 10

        const draw = () => {
            ctx.clearRect(0, 0, size, size)

            if (items.length === 0) return

            const arc = (2 * Math.PI) / items.length

            items.forEach((item, i) => {
                const angle = i * arc + rotation
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, angle, angle + arc)
                ctx.lineTo(centerX, centerY)
                ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 60%)`
                ctx.fill()
                ctx.stroke()

                ctx.save()
                ctx.translate(centerX, centerY)
                ctx.rotate(angle + arc / 2)
                ctx.textAlign = "right"
                ctx.fillStyle = "#fff"
                ctx.font = "bold 20px Inter"
                ctx.fillText(item, radius - 40, 10)
                ctx.restore()
            })

            // Arrow
            ctx.beginPath()
            ctx.moveTo(size - 30, centerY)
            ctx.lineTo(size + 10, centerY - 20)
            ctx.lineTo(size + 10, centerY + 20)
            ctx.fillStyle = "white"
            ctx.fill()
        }

        draw()
    }, [items, rotation])

    // Spin Logic
    useEffect(() => {
        if (isSpinning) {
            let speed = 0.4
            let currentRot = rotation
            const duration = 5000 // 5 seconds
            const startTime = Date.now()

            const animate = () => {
                const now = Date.now()
                const elapsed = now - startTime

                if (elapsed < duration) {
                    // Easing out
                    const remaining = duration - elapsed
                    speed = (remaining / duration) * 0.4 // Slow down
                    currentRot += speed
                    setRotation(currentRot)
                    requestAnimationFrame(animate)
                } else {
                    // Stop
                    const normalizedRot = currentRot % (2 * Math.PI)
                    // Calculate winner
                    // 0 is at right (3 o'clock). 
                    // Items are drawn clockwise. 
                    // Arrow is at Right.
                    // So we need to see which arc intersects with 0 (2PI)
                    // Actually Canvas arc starts at 3 o'clock.
                    // So if we rotate by R, the item at angle 0 is different.
                    // It's a bit complex math, let's simplify:
                    // Winner index is based on total rotation?

                    const arc = (2 * Math.PI) / items.length
                    // reverse rotation to find index?
                    // The wheel rotates CLOCKWISE (positive angle).
                    // The pointer is static at 0.
                    // Item i is at (i*arc + rotation).
                    // We want i such that (i*arc + rotation) is close to 0 (modulo 2PI).
                    // Actually, pointer is at 0 (Right).
                    // We check which segment overlaps 0.
                    // Start angle of segment i: S = (i*arc + rotation) % 2PI
                    // End angle of segment i: E = (S + arc)
                    // We need 0 (or 2PI) to be between S and E.

                    // Simpler: Just pick random winner at start and rotate to it?
                    // But I implemented physics-ish spin.
                    // Let's deduce winner from final rotation.

                    // normalizedRot is [0, 2PI]
                    // segment i starts at i*arc.
                    // rotated segment i starts at i*arc + rot.
                    // We want to know which 'i' covers angle 0 (or 2PI).
                    // Angle 0 relative to wheel = -rotation
                    // normalize (-rotation) to [0, 2PI]
                    let angleAtPointer = (2 * Math.PI - (currentRot % (2 * Math.PI))) % (2 * Math.PI)
                    const winningIndex = Math.floor(angleAtPointer / ((2 * Math.PI) / items.length))

                    onSpinEnd(items[winningIndex])
                }
            }
            requestAnimationFrame(animate)
        }
    }, [isSpinning, items.length]) // Warning: deps might restart spin if items change mid-spin

    return (
        <div className="relative flex justify-center items-center">
            <canvas ref={canvasRef} className="max-w-full" />
        </div>
    )
}
