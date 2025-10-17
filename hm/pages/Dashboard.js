import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  Activity,
  Heart,
  TrendingUp,
  Zap,
  Clock,
  BarChart3
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { motion } from "framer-motion";

import MaterialStatsCard from "../components/dashboard/MaterialStatsCard";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";
import RecentPatients from "../components/dashboard/RecentPatients";
import UpcomingAppointments from "../components/dashboard/UpcomingAppointments";
import MolecularPattern from "../components/medical/MolecularPattern";
import DNAHelix from "../components/medical/DNAHelix";
import HolographicOverlay from "../components/medical/HolographicOverlay";
import { ShaderAnimation } from "../components/ui/shader-animation.js";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      base44.auth.redirectToLogin(window.location.pathname);
    }
  };

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list("-created_date"),
    initialData: [],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-created_date"),
    initialData: [],
  });

  const activePatients = patients.filter(p => p.status === "Active" || p.status === "Under Treatment");
  const todayAppointments = appointments.filter(a => {
    const today = format(new Date(), "yyyy-MM-dd");
    return a.date === today && a.status === "Scheduled";
  });
  const upcomingAppointments = appointments.filter(a => {
    const today = new Date();
    const appointmentDate = new Date(a.date);
    return appointmentDate >= today && a.status === "Scheduled";
  }).slice(0, 5);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-cyan-50">
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900">
      <MolecularPattern className="opacity-30" />

      {/* Shader Animation Hero Section */}
      <div className="relative h-64 md:h-80 mb-8 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 opacity-40">
          <ShaderAnimation />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-50 dark:to-gray-900" />

        {/* Hero Header with Shader Background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 h-full flex items-center justify-center p-4 md:p-8"
        >
          <div className="max-w-5xl w-full">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 p-[2px] shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(99, 102, 241, 0.5)",
                    "0 0 60px rgba(139, 92, 246, 0.6)",
                    "0 0 30px rgba(99, 102, 241, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-full h-full rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-10 h-10 md:w-12 md:h-12 text-violet-600" />
                </div>
              </motion.div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-lg">
                  Welcome back, {user.full_name}
                </h1>
                <p className="text-white/90 dark:text-gray-200 mt-2 flex items-center justify-center md:justify-start gap-2 text-lg">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Advanced Healthcare Command Center
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Stats Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <MaterialStatsCard
              title="Total Patients"
              value={patients.length}
              icon={Users}
              gradient="from-indigo-500 to-indigo-600"
              subtitle={`${activePatients.length} active`}
              trend={8}
            />
            <MaterialStatsCard
              title="Appointments"
              value={appointments.length}
              icon={Calendar}
              gradient="from-emerald-500 to-teal-600"
              subtitle={`${todayAppointments.length} today`}
              trend={12}
            />
            <MaterialStatsCard
              title="Active Cases"
              value={activePatients.length}
              icon={Heart}
              gradient="from-violet-500 to-purple-600"
              subtitle="under treatment"
              trend={-3}
            />
            <MaterialStatsCard
              title="Success Rate"
              value="94.8%"
              icon={TrendingUp}
              gradient="from-cyan-500 to-blue-600"
              subtitle="recovery metrics"
              trend={5}
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <HolographicOverlay>
                <RecentPatients
                  patients={patients.slice(0, 5)}
                  isLoading={patientsLoading}
                />
              </HolographicOverlay>
              
              <HolographicOverlay>
                <UpcomingAppointments
                  appointments={upcomingAppointments}
                  isLoading={appointmentsLoading}
                />
              </HolographicOverlay>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AIInsightsCard />
              
              {/* DNA Visualization Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 backdrop-blur-md border border-cyan-200/50 dark:border-cyan-700/50 p-6 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-40">
                  <DNAHelix />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Genetic Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Real-time genomic data processing
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "DNA Sequencing", value: "98.7%" },
                      { label: "Mutation Detection", value: "Active" },
                      { label: "Sample Processing", value: "12 pending" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Clock, label: "Avg Wait", value: "8m", color: "from-amber-500 to-orange-500" },
                  { icon: BarChart3, label: "Efficiency", value: "96%", color: "from-emerald-500 to-teal-500" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                    <stat.icon className="w-8 h-8 mb-3 text-gray-700 dark:text-gray-300" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
