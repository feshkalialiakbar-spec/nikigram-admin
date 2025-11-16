'use client';

import Ticket from './Ticket';
import { TicketRequestApprovalProps } from '@/components/tasks/types';

// This component now delegates to the unified Ticket view.
const TicketRequestApproval: React.FC<TicketRequestApprovalProps> = (props) => {
  return <Ticket {...props} />;
};

export default TicketRequestApproval;
