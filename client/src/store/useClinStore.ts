import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ClinicalTriageSummary, PrescriptionPlan, DoctorSpecialist, Hospital, NearbyFacilityItem } from '../types';

interface ClinState {
  chatMessages: ChatMessage[];
  lastTriageSummary: ClinicalTriageSummary | null;
  lastPrescriptionPlan: PrescriptionPlan | null;
  lastSpecialistReferral: any | null;
  lastNearbyFacilities: NearbyFacilityItem[];
  userLocation: { latitude: number; longitude: number } | null;
  isOverlayActive: boolean;
  
  // Actions
  addMessage: (msg: ChatMessage) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  updateTriageData: (data: {
    triageSummary?: ClinicalTriageSummary;
    prescriptionPlan?: PrescriptionPlan;
    specialistReferral?: any;
    nearbyFacilities?: NearbyFacilityItem[];
  }) => void;
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
  setOverlayActive: (active: boolean) => void;
  clearChat: () => void;
}

export const useClinStore = create<ClinState>()(
  persist(
    (set) => ({
      chatMessages: [],
      lastTriageSummary: null,
      lastPrescriptionPlan: null,
      lastSpecialistReferral: null,
      lastNearbyFacilities: [],
      userLocation: null,
      isOverlayActive: false,

      addMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      setChatMessages: (msgs) => set({ chatMessages: msgs }),
      
      updateTriageData: (data) => set((state) => ({
        lastTriageSummary: data.triageSummary || state.lastTriageSummary,
        lastPrescriptionPlan: data.prescriptionPlan || state.lastPrescriptionPlan,
        lastSpecialistReferral: data.specialistReferral || state.lastSpecialistReferral,
        lastNearbyFacilities: data.nearbyFacilities || state.lastNearbyFacilities,
      })),
      
      setUserLocation: (location) => set({ userLocation: location }),
      setOverlayActive: (active) => set({ isOverlayActive: active }),
      
      clearChat: () => set({
        chatMessages: [],
        lastTriageSummary: null,
        lastPrescriptionPlan: null,
        lastSpecialistReferral: null,
        lastNearbyFacilities: [],
      }),
    }),
    {
      name: 'clin-ai-storage', // unique name
      partialize: (state) => ({
        // only persist these fields
        chatMessages: state.chatMessages,
        lastTriageSummary: state.lastTriageSummary,
        lastPrescriptionPlan: state.lastPrescriptionPlan,
        lastSpecialistReferral: state.lastSpecialistReferral,
        lastNearbyFacilities: state.lastNearbyFacilities,
        userLocation: state.userLocation,
      }),
    }
  )
);
