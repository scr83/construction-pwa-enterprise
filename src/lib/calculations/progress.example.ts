/**
 * Usage Examples for Progress Calculation Functions
 * 
 * This file demonstrates how to use the progress calculation utilities
 * for Chilean construction workflow tracking.
 */

import { 
  calculateActivityProgress, 
  calculateAverageProgress, 
  calculateSimpleProgress,
  getCurrentPhase,
  getPhaseNames,
  type ActivityProgress,
  type ProgressSummary
} from './progress';
import type { ConstructionActivity } from '@prisma/client';

// Example: Single activity progress calculation
export function exampleSingleActivityProgress() {
  // Mock ConstructionActivity with some progress
  const activity: ConstructionActivity = {
    id: 'activity-123',
    projectId: 'project-456',
    partidaId: 'partida-789',
    name: 'Excavación de cimientos',
    description: 'Excavación para fundaciones del edificio A',
    sequence: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Phase 1: Planning (4 states) - All completed
    kitMaterialInicial: true,        // ✓
    kitMaterialAjustado: true,       // ✓
    faenaContratada: true,           // ✓
    subcontratoAsignado: true,       // ✓
    
    // Phase 2: Materials (5 states) - Partially completed
    kitInicialCotizado: true,        // ✓
    solpedInicialEmitida: true,      // ✓
    kitComprado: false,              // ✗
    kitDisponibleBodega: false,      // ✗
    kitEntregadoTerreno: false,      // ✗
    
    // Phase 3: Execution (3 states) - Not started
    faenaEjecutada: false,           // ✗
    entregadoCalidad: false,         // ✗
    tratoPagado: false,              // ✗
    
    // Phase 4: Payment (1 state) - Not started
    pagoCursado: false,              // ✗
    
    // Additional fields
    fechaEjecucion: null,
    completedThisWeek: false,
    weekNumber: null
  };

  const progress: ActivityProgress = calculateActivityProgress(activity);
  
  console.log('Single Activity Progress:');
  console.log(`- Activity ID: ${progress.activityId}`);
  console.log(`- Progress: ${progress.completedSteps}/${progress.totalSteps} (${progress.progressPercentage}%)`);
  console.log(`- Current Phase: ${progress.currentPhase}`);
  
  return progress;
}

// Example: Multiple activities average progress
export function exampleMultipleActivitiesProgress() {
  const activities: ConstructionActivity[] = [
    // Activity 1: Just started
    {
      id: 'act-1',
      projectId: 'proj-1',
      partidaId: 'part-1',
      name: 'Preparación terreno',
      description: null,
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      kitMaterialInicial: true,
      kitMaterialAjustado: false,
      faenaContratada: false,
      subcontratoAsignado: false,
      kitInicialCotizado: false,
      solpedInicialEmitida: false,
      kitComprado: false,
      kitDisponibleBodega: false,
      kitEntregadoTerreno: false,
      faenaEjecutada: false,
      entregadoCalidad: false,
      tratoPagado: false,
      pagoCursado: false,
      fechaEjecucion: null,
      completedThisWeek: false,
      weekNumber: null
    },
    
    // Activity 2: Half completed
    {
      id: 'act-2',
      projectId: 'proj-1',
      partidaId: 'part-2',
      name: 'Excavación',
      description: null,
      sequence: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      kitMaterialInicial: true,
      kitMaterialAjustado: true,
      faenaContratada: true,
      subcontratoAsignado: true,
      kitInicialCotizado: true,
      solpedInicialEmitida: true,
      kitComprado: true,
      kitDisponibleBodega: false,
      kitEntregadoTerreno: false,
      faenaEjecutada: false,
      entregadoCalidad: false,
      tratoPagado: false,
      pagoCursado: false,
      fechaEjecucion: null,
      completedThisWeek: false,
      weekNumber: null
    },
    
    // Activity 3: Fully completed
    {
      id: 'act-3',
      projectId: 'proj-1',
      partidaId: 'part-3',
      name: 'Instalación eléctrica',
      description: null,
      sequence: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      kitMaterialInicial: true,
      kitMaterialAjustado: true,
      faenaContratada: true,
      subcontratoAsignado: true,
      kitInicialCotizado: true,
      solpedInicialEmitida: true,
      kitComprado: true,
      kitDisponibleBodega: true,
      kitEntregadoTerreno: true,
      faenaEjecutada: true,
      entregadoCalidad: true,
      tratoPagado: true,
      pagoCursado: true,
      fechaEjecucion: new Date(),
      completedThisWeek: true,
      weekNumber: 42
    }
  ];

  const summary: ProgressSummary = calculateAverageProgress(activities);
  
  console.log('\nMultiple Activities Summary:');
  console.log(`- Total Activities: ${summary.totalActivities}`);
  console.log(`- Average Progress: ${summary.averageProgress}%`);
  console.log(`- Completed: ${summary.completedActivities}`);
  console.log(`- In Progress: ${summary.activitiesInProgress}`);
  
  return summary;
}

// Example: Phase detection
export function examplePhaseDetection() {
  console.log('\nPhase Names:');
  const phases = getPhaseNames();
  Object.entries(phases).forEach(([key, value]) => {
    console.log(`- ${key}: ${value}`);
  });
  
  // Test activities in different phases
  const testActivities = [
    { name: 'New Activity', activity: { kitMaterialInicial: false, kitMaterialAjustado: false } },
    { name: 'Planning Phase', activity: { kitMaterialInicial: true, kitMaterialAjustado: true } },
    { name: 'Materials Phase', activity: { kitInicialCotizado: true, solpedInicialEmitida: true } },
    { name: 'Execution Phase', activity: { kitEntregadoTerreno: true, faenaEjecutada: true } },
    { name: 'Payment Phase', activity: { tratoPagado: true } },
    { name: 'Completed', activity: { pagoCursado: true } }
  ];
  
  console.log('\nPhase Detection Examples:');
  testActivities.forEach(({ name, activity }) => {
    // Fill missing fields with defaults
    const fullActivity = {
      id: 'test',
      projectId: 'test',
      partidaId: 'test',
      name: 'test',
      description: null,
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      kitMaterialInicial: false,
      kitMaterialAjustado: false,
      faenaContratada: false,
      subcontratoAsignado: false,
      kitInicialCotizado: false,
      solpedInicialEmitida: false,
      kitComprado: false,
      kitDisponibleBodega: false,
      kitEntregadoTerreno: false,
      faenaEjecutada: false,
      entregadoCalidad: false,
      tratoPagado: false,
      pagoCursado: false,
      fechaEjecucion: null,
      completedThisWeek: false,
      weekNumber: null,
      ...activity
    } as ConstructionActivity;
    
    const phase = getCurrentPhase(fullActivity);
    console.log(`- ${name}: ${phase}`);
  });
}

// Example: Simple progress utility
export function exampleSimpleProgress() {
  console.log('\nSimple Progress Examples:');
  
  const examples = [
    { completed: 0, total: 10 },
    { completed: 3, total: 10 },
    { completed: 7, total: 10 },
    { completed: 10, total: 10 },
    { completed: 5, total: 0 },  // Edge case
    { completed: -1, total: 10 }, // Edge case
  ];
  
  examples.forEach(({ completed, total }) => {
    const percentage = calculateSimpleProgress(completed, total);
    console.log(`- ${completed}/${total} = ${percentage}%`);
  });
}

// Run all examples
export function runAllExamples() {
  console.log('=== Chilean Construction Progress Calculation Examples ===\n');
  
  exampleSingleActivityProgress();
  exampleMultipleActivitiesProgress();
  examplePhaseDetection();
  exampleSimpleProgress();
  
  console.log('\n=== Examples completed ===');
}

// Export for use in other modules
export default {
  exampleSingleActivityProgress,
  exampleMultipleActivitiesProgress,
  examplePhaseDetection,
  exampleSimpleProgress,
  runAllExamples
};