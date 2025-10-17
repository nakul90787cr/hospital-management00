import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import NeuralNetwork from '../medical/NeuralNetwork';

export default function AIInsightsCard() {
  const [currentInsight, setCurrentInsight] = useState(0);

  const insights = [
    {
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      title: "Patient Recovery Rate",
      message: "15% improvement in recovery time detected",
      type: "positive"
    },
    {
      icon: AlertCircle,
      color: "from-amber-500 to-orange-500",
      title: "Resource Allocation",
      message: "High demand predicted for next week",
      type: "warning"
    },
    {
      icon: CheckCircle,
      color: "from-violet-500 to-purple-500",
      title: "Treatment Efficacy",
      message: "AI suggests optimized medication schedule",
      type: "info"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = insights[currentInsight];
  const IconComponent = current.icon;

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl backdrop-blur-md bg-gradient-to-br from-indigo-50/90 to-violet-50/90 dark:from-gray-900/90 dark:to-indigo-900/90 rounded-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <NeuralNetwork />
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-violet-600" />
          </motion.div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Health Insights
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className={`p-3 rounded-2xl bg-gradient-to-br ${current.color} shadow-lg`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {current.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {current.message}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 justify-center pt-2">
          {insights.map((_, index) => (
            <motion.button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentInsight
                  ? 'w-8 bg-gradient-to-r from-indigo-500 to-violet-500'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              onClick={() => setCurrentInsight(index)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.div
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-200/50 dark:border-indigo-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <span className="font-semibold">Powered by Advanced ML Models</span> • Real-time Analysis
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}