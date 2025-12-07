"use client"

import { useState } from "react"
import { Role } from "@/lib/team-builder/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Shield, Users } from "lucide-react"

interface RoleManagerProps {
    roles: Role[]
    onChange: (roles: Role[]) => void
}

export function RoleManager({ roles, onChange }: RoleManagerProps) {
    const addRole = () => {
        const newRole: Role = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Role ${roles.length + 1}`,
            color: "bg-gray-500",
            countPerTeam: 1
        }
        onChange([...roles, newRole])
    }

    const updateRole = (id: string, updates: Partial<Role>) => {
        onChange(roles.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    }

    const removeRole = (id: string) => {
        onChange(roles.filter((r) => r.id !== id))
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Active Roles</h4>
                <Button onClick={addRole} size="sm" variant="ghost" className="h-7 text-xs">
                    <Plus className="mr-1 size-3" /> Add Role
                </Button>
            </div>

            <div className="space-y-2">
                {roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2 bg-secondary/30 p-2 rounded-md">
                        <Shield className="size-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                            <Input
                                value={role.name}
                                onChange={(e) => updateRole(role.id, { name: e.target.value })}
                                className="h-7 text-xs bg-transparent border-0 focus-visible:ring-0 px-1 placeholder:text-muted-foreground/50"
                                placeholder="Role Name"
                            />
                        </div>

                        <div className="flex items-center gap-1 bg-background/20 rounded px-2" title="Players per Team">
                            <Users className="size-3 text-muted-foreground" />
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={role.countPerTeam}
                                onChange={(e) => updateRole(role.id, { countPerTeam: parseInt(e.target.value) || 1 })}
                                className="w-8 h-7 bg-transparent text-center text-xs focus:outline-none"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeRole(role.id)}
                        >
                            <X className="size-3" />
                        </Button>
                    </div>
                ))}
                {roles.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                        No roles defined.
                    </p>
                )}
            </div>
        </div>
    )
}
