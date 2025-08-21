export default function KpiCard({ title, value }: { title: string; value: number | string }){
  return (
    <div className="card p-4 w-[300px]">
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-sm font-medium text-gray-500">{title}</div>
    </div>
  )
}