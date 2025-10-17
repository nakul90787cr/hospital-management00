import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function UpcomingAppointments({ appointments, isLoading }) {
  const statusColors = {
    Scheduled: "from-cyan-500 to-blue-500",
    Completed: "from-emerald-500 to-teal-500",
    Cancelled: "from-red-500 to-pink-500"
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-cyan-900/50">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <motion.div
            className="p-2 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </motion.div>
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Upcoming Appointments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                variants={item}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-5 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-cyan-900/20 rounded-2xl hover:shadow-xl transition-all duration-300 border border-cyan-200/50 dark:border-cyan-700/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">
                        {appointment.patient_name}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {appointment.patient_id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${statusColors[appointment.status]} text-white border-0 shadow-md px-3 py-1`}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Stethoscope className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Dr. {appointment.doctor_name}</span>
                    <Badge variant="outline" className="ml-2 text-xs border-indigo-200 dark:border-indigo-700">
                      {appointment.department}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <span>{format(new Date(appointment.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}