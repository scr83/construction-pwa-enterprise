'use client'

import * as React from 'react'
import { Card } from '@/components/atoms/Card'
import { MetricDisplay, type MetricDisplayProps } from '@/components/molecules/MetricDisplay'
import { cn } from '@/lib/utils'

export interface QuickStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  completedTasks: number
  totalTasks: number
  budgetExecuted: number
  totalBudget: number
  activitiesInProgress: number
  totalActivities: number
  variant?: 'default' | 'outline' | 'filled' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
}

const QuickStatsCard = React.forwardRef<HTMLDivElement, QuickStatsCardProps>(
  (
    {
      className,
      completedTasks,
      totalTasks,
      budgetExecuted,
      totalBudget,
      activitiesInProgress,
      totalActivities,
      variant = 'default',
      size = 'md',
      compact = false,
      ...props
    },
    ref
  ) => {
    // Calculate percentages for better insights
    const tasksCompletionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const budgetExecutionPercentage = totalBudget > 0 ? (budgetExecuted / totalBudget) * 100 : 0
    const activitiesProgressPercentage = totalActivities > 0 ? (activitiesInProgress / totalActivities) * 100 : 0

    // Shared metric display props
    const metricProps: Partial<MetricDisplayProps> = {
      compact,
      showTrend: false,
      showComparison: false,
      showProgress: true,
    }

    return (
      <Card
        ref={ref}
        variant={variant}
        size={size}
        className={cn('w-full', className)}
        {...props}
      >
        <div className={cn(
          'grid gap-4',
          compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3',
          'w-full'
        )}>
          {/* Tareas Completadas */}
          <MetricDisplay
            label="Tareas Completadas"
            value={completedTasks}
            metricType="count"
            target={totalTasks}
            subtitle={`de ${totalTasks} tareas`}
            threshold={{
              good: totalTasks * 0.8,
              warning: totalTasks * 0.5,
              critical: totalTasks * 0.3,
            }}
            {...metricProps}
          />

          {/* Presupuesto Ejecutado */}
          <MetricDisplay
            label="Presupuesto Ejecutado"
            value={budgetExecuted}
            metricType="currency"
            unit="CLP"
            target={totalBudget}
            subtitle={`${budgetExecutionPercentage.toFixed(1)}% del total`}
            threshold={{
              warning: totalBudget * 1.1, // Over budget by 10%
              critical: totalBudget * 1.2, // Over budget by 20%
            }}
            {...metricProps}
          />

          {/* Actividades en Curso */}
          <MetricDisplay
            label="Actividades en Curso"
            value={activitiesInProgress}
            metricType="count"
            target={totalActivities}
            subtitle={`de ${totalActivities} actividades`}
            threshold={{
              good: totalActivities * 0.6,
              warning: totalActivities * 0.3,
              critical: totalActivities * 0.1,
            }}
            {...metricProps}
          />
        </div>
      </Card>
    )
  }
)

QuickStatsCard.displayName = 'QuickStatsCard'

export { QuickStatsCard }