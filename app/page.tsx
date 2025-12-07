"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Disc, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Team Sync
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate toolkit for your gaming sessions. Create fair teams instantly or let the wheel decide your fate.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
        <Link href="/team-builder">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card className="h-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20 hover:border-indigo-500/50 transition-colors group cursor-pointer">
              <CardHeader>
                <Users className="size-12 text-indigo-400 mb-2" />
                <CardTitle className="text-2xl group-hover:text-indigo-400 transition-colors">Team Builder</CardTitle>
                <CardDescription>
                  Balance your lobby with role-based or random team generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Building <ArrowRight className="ml-2 size-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>

        <Link href="/wheel">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
          >
            <Card className="h-full bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-500/20 hover:border-pink-500/50 transition-colors group cursor-pointer">
              <CardHeader>
                <Disc className="size-12 text-pink-400 mb-2" />
                <CardTitle className="text-2xl group-hover:text-pink-400 transition-colors">Wheel of Fortune</CardTitle>
                <CardDescription>
                  Spin the wheel for giveaways, choices, or random eliminations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Spin Now <ArrowRight className="ml-2 size-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
