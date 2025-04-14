'use client';

import AdminLayout from './layout';

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 