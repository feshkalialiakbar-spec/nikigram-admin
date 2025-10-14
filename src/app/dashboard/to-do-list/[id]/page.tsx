'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TaskDetailPage from '@/components/TaskDetail/TaskDetailPage';

const ToDoListDetailPage: React.FC = () => {
  const params = useParams();
  const taskId = params.id as string;

  return <TaskDetailPage taskId={taskId} />;
};

export default ToDoListDetailPage;
