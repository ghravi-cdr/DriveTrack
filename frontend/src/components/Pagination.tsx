export default function Pagination({ page, pageSize, total, onChange }:{ page:number; pageSize:number; total:number; onChange:(p:number)=>void }){
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <button className="btn btn-ghost" onClick={()=>onChange(Math.max(1, page-1))}>Previous</button>
      <span>{page} / {pages}</span>
      <button className="btn btn-ghost" onClick={()=>onChange(Math.min(pages, page+1))}>Next</button>
    </div>
  )
}