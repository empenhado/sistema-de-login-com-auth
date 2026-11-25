
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  iconColor,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div className={`rounded-lg p-2 ${iconColor}`}>
          {icon}
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-bold text-gray-900">
        {value}
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}
