
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import TimeFrameSelector from '@/components/TabInsights/TimeFrameSelector';
import DataSummary from '@/components/TabInsights/DataSummary';
import TabActivityChart from '@/components/TabInsights/TabActivityChart';
import RecentTabsList from '@/components/TabInsights/RecentTabsList';

import { fetchTabLogs, filterByTimeFrame, groupByDomain, generateSummary } from '@/services/tabService';
import { TimeFrame, GroupedTabData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('daily');
  
  // Fetch tab logs
  const { data: tabLogs, isLoading, error } = useQuery({
    queryKey: ['tabLogs'],
    queryFn: fetchTabLogs,
  });
  
  // Filter and process the data based on selected timeframe
  const filteredLogs = tabLogs ? filterByTimeFrame(tabLogs, selectedTimeFrame) : [];
  const domainGroups = tabLogs ? groupByDomain(filteredLogs) : {};
  
  // Convert the grouped data to an array for the charts
  const chartData: GroupedTabData[] = Object.values(domainGroups);
  
  // Generate summary statistics
  const summary = tabLogs ? generateSummary(filteredLogs) : {
    totalTime: 0,
    mostVisitedTab: 'None',
    mostTimeSpentTab: 'None',
    averageSessionDuration: 0,
    totalTabs: 0
  };
  
  // Time frame display name
  const timeFrameDisplays = {
    'daily': 'Today',
    'weekly': 'This Week',
    'monthly': 'This Month'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tab Activity Dashboard</h2>
            <p className="text-muted-foreground">
              Track and analyze your browser tab usage
            </p>
          </div>
          
          <TimeFrameSelector 
            selectedTimeFrame={selectedTimeFrame}
            onTimeFrameChange={setSelectedTimeFrame}
          />
        </div>
        
        {isLoading ? (
          <div className="grid place-items-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading your tab insights...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle>Error Loading Data</CardTitle>
              <CardDescription>
                There was a problem retrieving your tab activity. Please make sure the backend server is running.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                If you're running this in Electron, ensure the Node.js backend process has started correctly.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <DataSummary 
              summary={summary} 
              timeFrame={timeFrameDisplays[selectedTimeFrame]} 
            />
            
            {chartData.length > 0 ? (
              <TabActivityChart data={chartData} />
            ) : (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle>No Chart Data Available</CardTitle>
                  <CardDescription>
                    There is no tab activity data for {timeFrameDisplays[selectedTimeFrame].toLowerCase()}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Try selecting a different time period or wait until more browsing data is collected.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <RecentTabsList tabs={filteredLogs.slice(0, 10)} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Index;
