/**
 * Progress Calculation Functions for Chilean Construction Workflow
 * 
 * This module provides progress calculation utilities for construction activities
 * based on the 14-state Chilean construction workflow tracking system.
 */

import { ConstructionActivity } from '@prisma/client';

/**
 * Progress information for a single construction activity
 */
export interface ActivityProgress {
  activityId: string;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  currentPhase: string;
}

/**
 * Summary of progress across multiple activities
 */
export interface ProgressSummary {
  totalActivities: number;
  averageProgress: number;
  completedActivities: number;
  activitiesInProgress: number;
}

/**
 * Chilean construction workflow phase names
 */
const PHASE_NAMES = {
  PLANIFICACION: 'Planificación',
  MATERIALES: 'Materiales', 
  EJECUCION: 'Ejecución',
  PAGO: 'Pago',
  COMPLETADO: 'Completado'
} as const;

/**
 * Returns the Spanish phase names for Chilean construction workflow
 * @returns Object with phase names in Spanish
 */
export function getPhaseNames() {
  return PHASE_NAMES;
}

/**
 * Determines the current construction phase based on completed workflow fields
 * @param activity - Construction activity object
 * @returns Current phase name in Spanish
 */
export function getCurrentPhase(activity: ConstructionActivity): string {
  // All workflow states completed
  if (activity.pagoCursado) {
    return PHASE_NAMES.COMPLETADO;
  }
  
  // Payment phase (final workflow state)
  if (activity.tratoPagado || activity.entregadoCalidad || activity.faenaEjecutada) {
    return PHASE_NAMES.PAGO;
  }
  
  // Execution phase (workflow states 10-12)
  if (activity.kitEntregadoTerreno || activity.kitDisponibleBodega || activity.kitComprado) {
    return PHASE_NAMES.EJECUCION;
  }
  
  // Materials phase (workflow states 5-9)
  if (activity.solpedInicialEmitida || activity.kitInicialCotizado) {
    return PHASE_NAMES.MATERIALES;
  }
  
  // Planning phase (workflow states 1-4) - default for new activities
  return PHASE_NAMES.PLANIFICACION;
}

/**
 * Calculates progress for a single construction activity based on 14 workflow states
 * @param activity - Construction activity from Prisma schema
 * @returns ActivityProgress object with detailed progress information
 */
export function calculateActivityProgress(activity: ConstructionActivity): ActivityProgress {
  if (!activity) {
    throw new Error('Activity is required for progress calculation');
  }

  // Define all 14 workflow boolean fields in order
  const workflowFields = [
    activity.kitMaterialInicial,        // 1. Kit Material Inicial
    activity.kitMaterialAjustado,       // 2. Kit Material Ajustado
    activity.faenaContratada,           // 3. Faena Contratada
    activity.subcontratoAsignado,       // 4. Subcontrato Asignado
    activity.kitInicialCotizado,        // 5. Kit Inicial Cotizado
    activity.solpedInicialEmitida,      // 6. Solped Inicial Emitida
    activity.kitComprado,               // 7. Kit Comprado
    activity.kitDisponibleBodega,       // 8. Kit Disponible Bodega
    activity.kitEntregadoTerreno,       // 9. Kit Entregado Terreno
    activity.faenaEjecutada,            // 10. Faena Ejecutada
    activity.entregadoCalidad,          // 11. Entregado Calidad
    activity.tratoPagado,               // 12. Trato Pagado
    activity.pagoCursado               // 13. Pago Cursado
  ];

  const totalSteps = workflowFields.length;
  const completedSteps = workflowFields.filter(Boolean).length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const currentPhase = getCurrentPhase(activity);

  return {
    activityId: activity.id,
    completedSteps,
    totalSteps,
    progressPercentage,
    currentPhase
  };
}

/**
 * Calculates average progress across multiple construction activities
 * @param activities - Array of construction activities
 * @returns ProgressSummary with aggregated progress data
 */
export function calculateAverageProgress(activities: ConstructionActivity[]): ProgressSummary {
  if (!activities || activities.length === 0) {
    return {
      totalActivities: 0,
      averageProgress: 0,
      completedActivities: 0,
      activitiesInProgress: 0
    };
  }

  const activityProgresses = activities.map(activity => {
    try {
      return calculateActivityProgress(activity);
    } catch (error) {
      // Handle individual activity calculation errors gracefully
      console.warn(`Error calculating progress for activity ${activity.id}:`, error);
      return {
        activityId: activity.id,
        completedSteps: 0,
        totalSteps: 13,
        progressPercentage: 0,
        currentPhase: PHASE_NAMES.PLANIFICACION
      };
    }
  });

  const totalActivities = activities.length;
  const averageProgress = Math.round(
    activityProgresses.reduce((sum, progress) => sum + progress.progressPercentage, 0) / totalActivities
  );
  
  const completedActivities = activityProgresses.filter(
    progress => progress.progressPercentage === 100
  ).length;
  
  const activitiesInProgress = activityProgresses.filter(
    progress => progress.progressPercentage > 0 && progress.progressPercentage < 100
  ).length;

  return {
    totalActivities,
    averageProgress,
    completedActivities,
    activitiesInProgress
  };
}

/**
 * Simple completion percentage calculation utility
 * @param completedSteps - Number of completed steps
 * @param totalSteps - Total number of steps
 * @returns Percentage between 0-100
 */
export function calculateSimpleProgress(completedSteps: number, totalSteps: number): number {
  if (totalSteps <= 0) {
    return 0;
  }
  
  if (completedSteps < 0) {
    return 0;
  }
  
  if (completedSteps >= totalSteps) {
    return 100;
  }
  
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Type guard to check if an object has the required ConstructionActivity properties
 * @param obj - Object to check
 * @returns Boolean indicating if object is a valid ConstructionActivity
 */
export function isValidConstructionActivity(obj: any): obj is ConstructionActivity {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.kitMaterialInicial === 'boolean' &&
    typeof obj.kitMaterialAjustado === 'boolean' &&
    typeof obj.faenaContratada === 'boolean' &&
    typeof obj.subcontratoAsignado === 'boolean' &&
    typeof obj.kitInicialCotizado === 'boolean' &&
    typeof obj.solpedInicialEmitida === 'boolean' &&
    typeof obj.kitComprado === 'boolean' &&
    typeof obj.kitDisponibleBodega === 'boolean' &&
    typeof obj.kitEntregadoTerreno === 'boolean' &&
    typeof obj.faenaEjecutada === 'boolean' &&
    typeof obj.entregadoCalidad === 'boolean' &&
    typeof obj.tratoPagado === 'boolean' &&
    typeof obj.pagoCursado === 'boolean'
  );
}

/**
 * Bulk progress calculation with error handling
 * @param activities - Array of construction activities (may include invalid entries)
 * @returns Object with valid progress calculations and errors
 */
export function calculateBulkProgress(activities: any[]) {
  const validActivities: ConstructionActivity[] = [];
  const errors: string[] = [];

  activities.forEach((activity, index) => {
    if (isValidConstructionActivity(activity)) {
      validActivities.push(activity);
    } else {
      errors.push(`Invalid activity at index ${index}: Missing required fields`);
    }
  });

  const summary = calculateAverageProgress(validActivities);
  const individualProgress = validActivities.map(calculateActivityProgress);

  return {
    summary,
    individualProgress,
    validCount: validActivities.length,
    totalCount: activities.length,
    errors
  };
}