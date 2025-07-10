import DashboardContent from '@/app/ui/dashboard/main/dashboard-content'

export default function DashboardPage() {
  return (
    <main className='max-w-5xl mx-auto py-8'>
      <DashboardContent />
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-32 bg-gray-100 rounded" />
      <div className="h-32 bg-gray-100 rounded" />
      <div className="h-32 bg-gray-100 rounded" />
      <div className="h-32 bg-gray-100 rounded" />
    </div>
  )
}
