import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: number;
  formattedValue?: string; 
  icon: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, formattedValue, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {formattedValue || value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);
