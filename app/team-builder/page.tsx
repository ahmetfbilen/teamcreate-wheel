"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Users, Settings2, Sparkles } from "lucide-react"
import { generateTeams } from "@/lib/team-builder/logic"
import { Player, Role, Team } from "@/lib/team-builder/types"
import { RoleManager } from "@/components/team-builder/RoleManager"
import { cn } from "@/lib/utils"

export default function TeamBuilderPage() {
    // State
    const [playerInput, setPlayerInput] = useState("")
    const [teamCount, setTeamCount] = useState(2)
    const [rolesEnabled, setRolesEnabled] = useState(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [parsedPlayers, setParsedPlayers] = useState<Player[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [isGenerated, setIsGenerated] = useState(false)

    // Parse players from text input
    useEffect(() => {
        const names = playerInput
            .split("\n")
            .map((n) => n.trim())
            .filter((n) => n.length > 0)

        // Simple parsing
        const newPlayers: Player[] = names.map((name, index) => ({
            id: `p-${index}-${name}`,
            name,
            roleId: undefined
        }))

        if (newPlayers.length !== parsedPlayers.length || !newPlayers.every((p, i) => p.name === parsedPlayers[i]?.name)) {
            setParsedPlayers(newPlayers)
        }
    }, [playerInput])

    const handleGenerate = () => {
        console.log("Generating teams...")
        console.log("Inputs:", { parsedPlayers, teamCount, rolesEnabled, roles })

        try {
            const result = generateTeams(parsedPlayers, {
                teamCount,
                rolesEnabled,
                roles
            })
            console.log("Generated Teams:", result)
            setTeams(result)
            setIsGenerated(true)
        } catch (error) {
            console.error("Failed to generate teams:", error)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">Team Builder</h1>
                <p className="text-muted-foreground">Add players, configure rules, and generate balanced teams.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs & Settings */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-card/30 border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="size-5 text-indigo-400" />
                                Players
                            </CardTitle>
                            <CardDescription>Enter names, one per line</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={playerInput}
                                onChange={(e) => setPlayerInput(e.target.value)}
                                placeholder="Ahmet&#10;Mehmet&#10;Ayşe&#10;Fatma"
                                className="min-h-[200px] bg-background/50 font-mono text-sm"
                            />
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{parsedPlayers.length} players added</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPlayerInput("")}
                                    className="h-6 px-2 hover:text-destructive"
                                >
                                    Clear all
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/30 border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings2 className="size-5 text-indigo-400" />
                                Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">Team Count: {teamCount}</label>
                                </div>
                                <Slider
                                    value={[teamCount]}
                                    onValueChange={(v) => setTeamCount(v[0])}
                                    min={2}
                                    max={Math.max(2, Math.floor(parsedPlayers.length / 1) || 10)}
                                    step={1}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Enable Roles</label>
                                    <p className="text-xs text-muted-foreground">Randomly assign roles to players</p>
                                </div>
                                <Switch checked={rolesEnabled} onCheckedChange={setRolesEnabled} />
                            </div>

                            <AnimatePresence>
                                {rolesEnabled && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <RoleManager roles={roles} onChange={setRoles} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={handleGenerate}
                        disabled={parsedPlayers.length < 2}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 py-6 text-lg font-bold"
                    >
                        <Sparkles className="mr-2 size-5" /> Generate Teams
                    </Button>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-8">
                    {!isGenerated ? (
                        <div
                            className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5"
                        >
                            <div className="text-center text-muted-foreground space-y-4">
                                <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                                    <Users className="size-10 opacity-30" />
                                </div>
                                <p>Add players and click generate to see teams here</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {teams.length === 0 && (
                                <div className="col-span-2 text-center text-red-400">
                                    No teams were generated. Check console for details.
                                </div>
                            )}
                            {teams.map((team) => (
                                <Card key={team.id} className="h-full border-t-4 bg-card/40 backdrop-blur-md overflow-hidden relative group hover:bg-card/60 transition-colors" style={{ borderTopColor: 'var(--primary)' }}>
                                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity", team.color)} />
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex justify-between items-center text-xl">
                                            {team.name}
                                            <span className="text-xs font-normal px-2 py-1 rounded bg-white/10 text-muted-foreground">
                                                {team.players.length} Players
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {team.players.map((player) => (
                                                <li key={player.id} className="flex items-center justify-between p-2 rounded bg-black/20 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full bg-white/50" />
                                                        {player.name}
                                                    </div>
                                                    {player.roleId && (
                                                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                                                            {roles.find(r => r.id === player.roleId)?.name || "Unknown"}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
