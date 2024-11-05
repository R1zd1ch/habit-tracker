import Link from 'next/link';
import React from 'react';

type BreadcrumbItem = {
  label: string;
  url: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const BreadCrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Link href={item.url}>{item.label}</Link>
          {index < items.length - 1 && <span className="mx-2">{'>'}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadCrumb;
