import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import PatientForm from "../components/patients/PatientForm";
import PatientList from "../components/patients/PatientList";
import PatientDetails from "../components/patients/PatientDetails";

export default function Patients() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list("-created_date"),
    initialData: [],
  });

  const createPatientMutation = useMutation({
    mutationFn: (patientData) => base44.entities.Patient.create(patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowForm(false);
      setEditingPatient(null);
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, patientData }) => base44.entities.Patient.update(id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowForm(false);
      setEditingPatient(null);
      setSelectedPatient(null);
    },
  });

  const deletePatientMutation = useMutation({
    mutationFn: (id) => base44.entities.Patient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setSelectedPatient(null);
    },
  });

  const handleSubmit = async (patientData) => {
    if (editingPatient) {
      updatePatientMutation.mutate({ id: editingPatient.id, patientData });
    } else {
      createPatientMutation.mutate(patientData);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
    setSelectedPatient(null);
  };

  const handleDelete = (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      deletePatientMutation.mutate(patient.id);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowForm(false);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact?.includes(searchTerm)
  );

  const canModifyPatients = user?.role === "Doctor";

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-1">Manage patient records and information</p>
          </div>
          {canModifyPatients && (
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingPatient(null);
                setSelectedPatient(null);
              }}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Patient
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search patients by name, disease, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {showForm ? (
                <PatientForm
                  key="form"
                  patient={editingPatient}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingPatient(null);
                  }}
                />
              ) : (
                <PatientList
                  key="list"
                  patients={filteredPatients}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                  canModify={canModifyPatients}
                  selectedPatientId={selectedPatient?.id}
                />
              )}
            </AnimatePresence>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {selectedPatient && (
                <PatientDetails
                  key={selectedPatient.id}
                  patient={selectedPatient}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={() => setSelectedPatient(null)}
                  canModify={canModifyPatients}
                  userRole={user.role}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}