import AddTenantForm from "@/components/AddTenantForm"

export default function AddTenantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Tenant</h1>
        <p className="text-muted-foreground">Add a new tenant to your rental management system</p>
      </div>

      <AddTenantForm />
    </div>
  )
}
