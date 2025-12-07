export type Role = {
    id: string
    name: string
    color: string
    countPerTeam: number
}

export type Player = {
    id: string
    name: string
    roleId?: string // If null, "Flex" or no role
}

export type Team = {
    id: string
    name: string
    color: string
    players: Player[]
}

export type TeamBuilderSettings = {
    teamCount: number
    rolesEnabled: boolean
    roles: Role[]
}
