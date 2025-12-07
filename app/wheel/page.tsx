"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Wheel } from "@/components/wheel/Wheel"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Disc, Trophy, Info, RotateCcw } from "lucide-react"

export default function WheelPage() {
    const [input, setInput] = useState("")
    const [items, setItems] = useState<string[]>([])
    const [winner, setWinner] = useState<string | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [eliminationMode, setEliminationMode] = useState(false)

    useEffect(() => {
        const list = input
            .split("\n")
            .map((i) => i.trim())
            .filter((i) => i.length > 0)

        // Only update if changed (simple check)
        if (JSON.stringify(list) !== JSON.stringify(items) && !isSpinning) {
            setItems(list)
        }
    }, [input, isSpinning]) // Don't update items while spinning to avoid glitch

    const handleSpin = () => {
        if (items.length < 2) return
        setWinner(null)
        setIsSpinning(true)
    }

    const onSpinEnd = (wonItem: string) => {
        setIsSpinning(false)
        setWinner(wonItem)

        // Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })

        if (eliminationMode) {
            setTimeout(() => {
                const newItems = items.filter(i => i !== wonItem)
                setInput(newItems.join("\n"))
                // items state updates via effect
            }, 2000) // Delay removal to see winner
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">Wheel of Fortune</h1>
                <p className="text-muted-foreground">Spin the wheel to make a decision or pick a winner.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Settings & Input */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-card/30 border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Disc className="size-5 text-pink-400" />
                                Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Elimination Mode</label>
                                    <p className="text-xs text-muted-foreground">Remove winner after spin</p>
                                </div>
                                <Switch checked={eliminationMode} onCheckedChange={setEliminationMode} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Items</label>
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isSpinning}
                                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                                    className="min-h-[200px] bg-background/50 font-mono text-sm"
                                />
                                <div className="text-xs text-muted-foreground text-right">
                                    {items.length} items
                                </div>
                            </div>

                            <Button
                                onClick={handleSpin}
                                disabled={isSpinning || items.length < 2}
                                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-500/20 py-6 text-lg font-bold"
                            >
                                {isSpinning ? "Spinning..." : "Spin the Wheel"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Wheel Display */}
                <div className="lg:col-span-8 flex flex-col items-center justify-center min-h-[500px] relative">
                    <AnimatePresence>
                        {winner && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                            >
                                <div className="bg-black/80 backdrop-blur-xl border border-pink-500/50 p-8 rounded-2xl text-center shadow-2xl shadow-pink-500/20 pointer-events-auto">
                                    <Trophy className="size-16 text-yellow-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Winner!</h2>
                                    <p className="text-2xl font-mono text-pink-400">{winner}</p>
                                    <Button
                                        onClick={() => setWinner(null)}
                                        variant="outline"
                                        className="mt-6 border-white/20 hover:bg-white/10"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Wheel
                            items={items.length > 0 ? items : ["Add", "Items", "To", "Spin"]}
                            isSpinning={isSpinning}
                            onSpinEnd={onSpinEnd}
                        />
                        {/* Pointer Overlay - handled inside Wheel Canvas technically, but external pointer is also okay. My Canvas has it. */}
                    </div>
                </div>
            </div>
        </div>
    )
}
