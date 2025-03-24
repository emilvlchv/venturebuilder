
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500 shadow-sm"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-500 shadow-sm"><Clock className="h-4 w-4 mr-1" /> In Progress</Badge>;
    case 'pending':
      return <Badge variant="outline" className="shadow-sm"><AlertCircle className="h-4 w-4 mr-1" /> Not Started</Badge>;
    default:
      return null;
  }
};
