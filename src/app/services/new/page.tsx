'use client';

import ServiceForm from '@/components/services/ServiceForm';
import { useRouter } from 'next/navigation';

export default function NewServicePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to create service');
    }

    router.push('/');
  };

  return (
    <div className="pb-6">
      <ServiceForm onSubmit={handleSubmit} />
    </div>
  );
}
