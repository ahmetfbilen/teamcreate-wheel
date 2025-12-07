import { Player, Role, Team, TeamBuilderSettings } from "./types"

export function generateTeams(
    players: Player[],
    settings: TeamBuilderSettings
): Team[] {
    // 1. Initialize Teams
    const teams: Team[] = Array.from({ length: settings.teamCount }, (_, i) => ({
        id: `team-${i}`,
        name: `Team ${i + 1}`,
        color: getRandomColor(i),
        players: [],
    }))

    // 2. Assign Random Roles (if enabled)
    let playersWithRoles = [...players] // Clone to avoid mutation
    // Reset roles first (since we are regenerating)
    playersWithRoles = playersWithRoles.map(p => ({ ...p, roleId: undefined }))

    // Shuffle all players first to ensure random role assignment
    playersWithRoles.sort(() => Math.random() - 0.5)

    if (settings.rolesEnabled && settings.roles.length > 0) {
        const assignedPlayers: Player[] = []
        const unassignedPlayers: Player[] = [...playersWithRoles]

        // For each role, we need to find (countPerTeam * teamCount) players
        settings.roles.forEach(role => {
            const totalNeeded = role.countPerTeam * settings.teamCount

            for (let i = 0; i < totalNeeded; i++) {
                if (unassignedPlayers.length > 0) {
                    const p = unassignedPlayers.pop()!
                    p.roleId = role.id
                    assignedPlayers.push(p)
                }
            }
        })

        // Re-merge
        // We have players with roles, and players without.
        // Now we need to distribute them to teams ensuring the constraints are met.
        // Strategy: Distribute Role A players evenly, Role B players evenly, etc.
        // Since we calculated totalNeeded = perTeam * teamCount, we should just round-robin them.

        // Let's grouping again
        const playersByRole: Record<string, Player[]> = {}

        assignedPlayers.forEach(p => {
            if (p.roleId) {
                if (!playersByRole[p.roleId]) playersByRole[p.roleId] = []
                playersByRole[p.roleId].push(p)
            }
        })

        // Distribute Role players
        Object.keys(playersByRole).forEach((roleId) => {
            const rolePlayers = playersByRole[roleId]
            rolePlayers.forEach((p, index) => {
                // We strictly want each team to fill its quota.
                // index 0 -> Team 0, index 1 -> Team 1...
                const teamIndex = index % settings.teamCount
                teams[teamIndex].players.push(p)
            })
        })

        // Distribute remaining (no role) players
        unassignedPlayers.forEach((p, index) => {
            // Sort teams by size to balance
            // But simple round robin works if we started balanced.
            // Let's just find the smallest team.
            teams.sort((a, b) => a.players.length - b.players.length)
            teams[0].players.push(p)
        })

        return teams

    } else {
        // Simple distribution without roles
        playersWithRoles.forEach((p, index) => {
            const teamIndex = index % settings.teamCount
            teams[teamIndex].players.push(p)
        })

        return teams
    }
}

function getRandomColor(index: number): string {
    const colors = [
        "from-red-500 to-orange-500",
        "from-blue-500 to-cyan-500",
        "from-green-500 to-emerald-500",
        "from-purple-500 to-pink-500",
        "from-yellow-500 to-amber-500",
        "from-indigo-500 to-violet-500",
    ]
    return colors[index % colors.length]
}
