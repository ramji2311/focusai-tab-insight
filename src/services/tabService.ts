
import { TabLog, TimeFrame, GroupedTabData, TabSummary } from '@/types';
import { mockTabLogs } from '@/lib/mockData';

// This will be replaced with actual Electron IPC calls later
export const fetchTabLogs = async (): Promise<TabLog[]> => {
  // In a real implementation, we would call the Electron API
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockTabLogs), 500);
  });
};

// Group tab data by domain
export const groupByDomain = (logs: TabLog[]): Record<string, GroupedTabData> => {
  const grouped: Record<string, GroupedTabData> = {};
  
  logs.forEach(log => {
    try {
      const url = new URL(log.url);
      const domain = url.hostname;
      
      if (!grouped[domain]) {
        grouped[domain] = {
          label: domain,
          totalDuration: 0,
          count: 0
        };
      }
      
      grouped[domain].totalDuration += log.duration;
      grouped[domain].count += 1;
    } catch (e) {
      // Handle invalid URLs
      console.error("Invalid URL:", log.url);
    }
  });
  
  return grouped;
};

// Filter logs by timeframe
export const filterByTimeFrame = (logs: TabLog[], timeFrame: TimeFrame): TabLog[] => {
  const now = new Date();
  const filtered = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    
    switch (timeFrame) {
      case 'daily':
        return logDate.toDateString() === now.toDateString();
      case 'weekly':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return logDate >= oneWeekAgo;
      case 'monthly':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return logDate >= oneMonthAgo;
      default:
        return true;
    }
  });
  
  return filtered;
};

// Generate summary statistics
export const generateSummary = (logs: TabLog[]): TabSummary => {
  if (logs.length === 0) {
    return {
      totalTime: 0,
      mostVisitedTab: 'None',
      mostTimeSpentTab: 'None',
      averageSessionDuration: 0,
      totalTabs: 0
    };
  }

  const totalTime = logs.reduce((sum, log) => sum + log.duration, 0);
  
  // Find most visited
  const visitCounts: Record<string, number> = {};
  const timeCounts: Record<string, number> = {};
  
  logs.forEach(log => {
    visitCounts[log.title] = (visitCounts[log.title] || 0) + 1;
    timeCounts[log.title] = (timeCounts[log.title] || 0) + log.duration;
  });
  
  const mostVisitedTab = Object.entries(visitCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  const mostTimeSpentTab = Object.entries(timeCounts)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  return {
    totalTime,
    mostVisitedTab,
    mostTimeSpentTab,
    averageSessionDuration: totalTime / logs.length,
    totalTabs: new Set(logs.map(log => log.title)).size
  };
};
