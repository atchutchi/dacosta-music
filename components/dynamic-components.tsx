import dynamic from 'next/dynamic'

// Lazy load heavy components with loading states
export const DynamicMusicSection = dynamic(
  () => import('./music-section'),
  {
    loading: () => (
      <div className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-96 mx-auto mb-12"></div>
            <div className="h-96 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
)

export const DynamicAboutSection = dynamic(
  () => import('./about-section'),
  {
    loading: () => (
      <div className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              <div className="space-y-4">
                <div className="h-64 bg-gray-800 rounded"></div>
                <div className="h-48 bg-gray-800 rounded"></div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="h-48 bg-gray-800 rounded"></div>
                <div className="h-64 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true
  }
)

export const DynamicRosterSection = dynamic(
  () => import('./roster-section'),
  {
    loading: () => (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-gray-800 rounded"></div>
                  <div className="h-12 bg-gray-800 rounded"></div>
                  <div className="h-16 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true
  }
)

// Note: Some components may not have default exports
// Only using components that definitely exist with default exports

export const DynamicBitWidget = dynamic(
  () => import('./BitWidget'),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-800 rounded"></div>
      </div>
    ),
    ssr: false
  }
) 