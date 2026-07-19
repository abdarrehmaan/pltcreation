'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface ProductSortSelectProps {
  sortOptions: { value: string; label: string }[];
  defaultValue: string;
}

export default function ProductSortSelect({ sortOptions, defaultValue }: ProductSortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page'); // Reset pagination on sort change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer"
      value={defaultValue}
      onChange={handleChange}
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
