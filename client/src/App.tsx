import React from 'react';
import { AnimationProvider } from './context/AnimationContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { SharedLayout } from './components/SharedLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientDashboard } from './pages/dashboards/PatientDashboard';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { PractitionerDashboard } from './pages/dashboards/PractitionerDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NewWorkflowPage } from './pages/NewWorkflowPage';
import { WorkflowExecutionPage } from './pages/WorkflowExecutionPage';
import { OutputsPage } from './pages/OutputsPage';
import { SpecialistsPage } from './pages/SpecialistsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { ExaminationsPage } from './pages/ExaminationsPage';

export const App: React.FC = () => {
  return (
    <AnimationProvider>
      <ThemeProvider>
        <Router>
        <Routes>
          {/* Standalone Authentication View */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Unified Clinical Layout with 260px Sidebar & Header */}
          <Route element={<SharedLayout />}>
            <Route path="/" element={<LandingPage />} />
            
            {/* Dynamic Role Redirection */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Role-Specific Protected Dashboards */}
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute allowedRoles={['patient', 'admin']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={['physician', 'admin']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/practitioner"
              element={
                <ProtectedRoute allowedRoles={['nurse', 'admin']}>
                  <PractitionerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Clinical Modules */}
            <Route path="/workflows/new" element={<NewWorkflowPage />} />
            <Route path="/workflows/:id" element={<WorkflowExecutionPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/specialists" element={<SpecialistsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/examinations" element={<ExaminationsPage />} />
            <Route path="/outputs" element={<OutputsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
    </AnimationProvider>
  );
};

export default App;
