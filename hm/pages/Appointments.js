import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Filter } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentList from "../components/appointments/AppointmentList";
import AppointmentFilters from "../components/appointments/AppointmentFilters";

export default function Appointments() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    date: "all"
  });

  const queryClient = useQueryClient();

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

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list("-date"),
    initialData: [],
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list(),
    initialData: [],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData) => base44.entities.Appointment.create(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, appointmentData }) => base44.entities.Appointment.update(id, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: (id) => base44.entities.Appointment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const handleSubmit = async (appointmentData) => {
    if (editingAppointment) {
      updateAppointmentMutation.mutate({ id: editingAppointment.id, appointmentData });
    } else {
      createAppointmentMutation.mutate(appointmentData);
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (appointment) => {
    if (window.confirm(`Are you sure you want to delete this appointment?`)) {
      deleteAppointmentMutation.mutate(appointment.id);
    }
  };

  const handleStatusChange = (appointment, newStatus) => {
    updateAppointmentMutation.mutate({
      id: appointment.id,
      appointmentData: { ...appointment, status: newStatus }
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = filters.status === "all" || appointment.status === filters.status;
    const departmentMatch = filters.department === "all" || appointment.department === filters.department;
    
    let dateMatch = true;
    if (filters.date === "today") {
      const today = new Date().toISOString().split('T')[0];
      dateMatch = appointment.date === today;
    } else if (filters.date === "upcoming") {
      const today = new Date();
      const appointmentDate = new Date(appointment.date);
      dateMatch = appointmentDate >= today;
    }
    
    return statusMatch && departmentMatch && dateMatch;
  });

  const canSchedule = user?.role === "Doctor" || user?.role === "Nurse";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
            <p className="text-gray-600 mt-1">Schedule and manage patient appointments</p>
          </div>
          {canSchedule && (
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingAppointment(null);
              }}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg"
            >
              <CalendarPlus className="w-5 h-5 mr-2" />
              Schedule Appointment
            </Button>
          )}
        </div>

        <AppointmentFilters
          filters={filters}
          onFilterChange={setFilters}
        />

        <AnimatePresence mode="wait">
          {showForm && (
            <AppointmentForm
              key="form"
              appointment={editingAppointment}
              patients={patients}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAppointment(null);
              }}
            />
          )}
        </AnimatePresence>

        <AppointmentList
          appointments={filteredAppointments}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          canModify={canSchedule}
        />
      </div>
    </div>
  );
}