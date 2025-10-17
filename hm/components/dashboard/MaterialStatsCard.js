import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import BiometricPulse from '../medical/BiometricPulse';

export default function MaterialStatsCard({ title, value, icon: Icon, gradient, subtitle, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-3xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full -mr-16 -mt-16" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 tracking-wide uppercase">{title}</p>
              <motion.p 
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                  {subtitle}
                  {trend && (
                    <motion.span
                      className={`text-xs px-2 py-1 rounded-full ${
                        trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </motion.span>
                  )}
                </p>
              )}
            </div>
            <motion.div 
              className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
          </div>
          
          <div className="h-8 mt-2 opacity-50">
            <BiometricPulse />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}