import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Activity } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function RecentPatients({ patients, isLoading }) {
  const statusColors = {
    Active: "from-emerald-500 to-teal-500",
    Discharged: "from-gray-400 to-gray-500",
    "Under Treatment": "from-indigo-500 to-violet-500"
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-gray-800/50 dark:to-indigo-900/50">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <motion.div
            className="p-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <User className="w-5 h-5 text-white" />
          </motion.div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Recent Patients
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No patients yet</p>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {patients.map((patient) => (
              <motion.div
                key={patient.id}
                variants={item}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-white font-bold text-xl">
                    {patient.name?.charAt(0) || 'P'}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {patient.name}
                    </h3>
                    <Badge className={`bg-gradient-to-r ${statusColors[patient.status]} text-white border-0 shadow-md px-3 py-1`}>
                      {patient.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    {patient.disease}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.contact}
                    </span>
                    <span>Age: {patient.age}</span>
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