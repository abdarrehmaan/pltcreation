import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  tag,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View All',
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-12',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      <div className={cn('flex flex-col gap-3', align === 'left' && viewAllHref ? 'md:flex-row md:items-end md:justify-between' : '')}>
        <div>
          {tag && (
            <div className={cn('section-tag', align === 'center' ? 'justify-center' : 'justify-start')}>
              {tag}
            </div>
          )}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors group flex-shrink-0"
          >
            {viewAllLabel}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
