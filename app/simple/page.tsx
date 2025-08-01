export default function SimpleDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Hello, Guest! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your rental management dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
              Guest
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Simple Dashboard:</strong> This is a test page without any stores or complex logic.
          </p>
        </div>
      </div>

      {/* Simple Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Test Card 1</h3>
          <p className="text-gray-600">This is a test card</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Test Card 2</h3>
          <p className="text-gray-600">This is another test card</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Test Card 3</h3>
          <p className="text-gray-600">This is a third test card</p>
        </div>
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold">Test Card 4</h3>
          <p className="text-gray-600">This is a fourth test card</p>
        </div>
      </div>
    </div>
  )
} 