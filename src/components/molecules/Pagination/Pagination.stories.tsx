import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'
import { useState } from 'react'

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de paginación optimizado para construcción. Mobile-first con terminología en español y botones touch-friendly.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['simple', 'numbered', 'advanced'],
      description: 'Variante del componente de paginación'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño de los controles'
    },
    alignment: {
      control: 'select',
      options: ['left', 'center', 'right', 'between'],
      description: 'Alineación de los controles'
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'Página actual'
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total de páginas'
    },
    totalItems: {
      control: { type: 'number', min: 0 },
      description: 'Total de elementos'
    },
    itemsPerPage: {
      control: { type: 'number', min: 1 },
      description: 'Elementos por página'
    },
    maxVisiblePages: {
      control: { type: 'number', min: 3, max: 10 },
      description: 'Máximo de páginas visibles'
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilitar controles'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

// Wrapper component para manejar el estado
function PaginationWrapper(props: any) {
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1)
  
  return (
    <div className="w-full max-w-4xl p-4">
      <Pagination
        {...props}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// Historia por defecto - Lista de proyectos
export const Default: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 97,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'md',
    alignment: 'between',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 5,
    disabled: false,
  },
}

// Paginación simple para móvil
export const Simple: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 5,
    totalPages: 15,
    totalItems: 148,
    itemsPerPage: 10,
    variant: 'simple',
    size: 'md',
    alignment: 'between',
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    disabled: false,
  },
}

// Muchas páginas con ellipsis
export const ManyPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 25,
    totalPages: 50,
    totalItems: 1247,
    itemsPerPage: 25,
    variant: 'numbered',
    size: 'md',
    alignment: 'center',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: false,
    showItemsInfo: true,
    maxVisiblePages: 7,
    disabled: false,
  },
}

// Pocas páginas - inspecciones de calidad
export const FewPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 2,
    totalPages: 3,
    totalItems: 23,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'lg',
    alignment: 'center',
    showFirstLast: false,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 5,
    disabled: false,
  },
}

// Estado deshabilitado
export const Disabled: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 3,
    totalPages: 8,
    totalItems: 76,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'md',
    alignment: 'between',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 5,
    disabled: true,
  },
}

// Solo una página
export const SinglePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 5,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'md',
    alignment: 'center',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 5,
    disabled: false,
  },
}

// Tamaño pequeño para sidebar
export const Small: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 4,
    totalPages: 12,
    totalItems: 115,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'sm',
    alignment: 'center',
    showFirstLast: false,
    showPrevNext: true,
    showPageInfo: false,
    showItemsInfo: false,
    maxVisiblePages: 3,
    disabled: false,
  },
}

// Tamaño grande para desktop
export const Large: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 7,
    totalPages: 20,
    totalItems: 487,
    itemsPerPage: 25,
    variant: 'advanced',
    size: 'lg',
    alignment: 'between',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 7,
    disabled: false,
  },
}

// Ejemplo con datos reales de construcción
export const ProjectsPagination: Story = {
  render: (args) => (
    <div className="w-full max-w-6xl p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Gestión de Proyectos
        </h2>
        <div className="text-sm text-gray-600 mb-4">
          Mostrando proyectos de construcción activos
        </div>
        <PaginationWrapper {...args} />
      </div>
    </div>
  ),
  args: {
    currentPage: 1,
    totalPages: 8,
    totalItems: 73,
    itemsPerPage: 10,
    variant: 'numbered',
    size: 'md',
    alignment: 'between',
    showFirstLast: true,
    showPrevNext: true,
    showPageInfo: true,
    showItemsInfo: true,
    maxVisiblePages: 5,
    disabled: false,
  },
}