import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, FileText, Activity } from "lucide-react";

export default function QuickActions({ userRole }) {
  const navigate = useNavigate();

  const actions = {
    Doctor: [
      { icon: UserPlus, label: "Add Patient", page: "Patients", color: "from-blue-500 to-blue-600" },
      { icon: CalendarPlus, label: "Schedule Appointment", page: "Appointments", color: "from-green-500 to-green-600" },
      { icon: FileText, label: "View Patients", page: "Patients", color: "from-purple-500 to-purple-600" },
      { icon: Activity, label: "View Appointments", page: "Appointments", color: "from-orange-500 to-orange-600" }
    ],
    Nurse: [
      { icon: FileText, label: "View Patients", page: "Patients", color: "from-blue-500 to-blue-600" },
      { icon: CalendarPlus, label: "Schedule Appointment", page: "Appointments", color: "from-green-500 to-green-600" },
      { icon: Activity, label: "View Appointments", page: "Appointments", color: "from-purple-500 to-purple-600" }
    ],
    Admin: [
      { icon: FileText, label: "View Patients", page: "Patients", color: "from-blue-500 to-blue-600" },
      { icon: Activity, label: "View Appointments", page: "Appointments", color: "from-green-500 to-green-600" }
    ]
  };

  const userActions = actions[userRole] || actions.Admin;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all duration-200 border-2"
              onClick={() => navigate(createPageUrl(action.page))}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}