import AddFlatForm from "@/components/AddFlatForm"

export default function AddFlatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Flat</h1>
        <p className="text-muted-foreground">Add a new flat to your rental management system</p>
      </div>

      <AddFlatForm />
    </div>
  )
}
