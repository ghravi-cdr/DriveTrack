import { useEffect, useState } from "react";
import { LogsAPI } from "../api"; 

export default function Logs() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    LogsAPI.list({ limit: 100 }).then(res => setItems(res.items));
  }, []);

  console.log("Logs Data: ", items);

  return (
    <div className="card p-4">
      <div className="text-sm font-bold text-gray-500 mb-3">Logs</div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-xs text-gray-500">
            <tr className="border-b">
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Action</th>
              <th className="text-left px-4 py-3">Record</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l: any, i: number) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3">
                  {l.Time ? new Date(l.Time).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3">{l.Name || "-"}</td>
                <td className="px-4 py-3">{l.Action || "-"}</td>
                <td className="px-4 py-3">
                  {l.Record ? JSON.stringify(l.Record) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
