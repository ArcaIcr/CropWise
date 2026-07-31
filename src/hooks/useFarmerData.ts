import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAuth } from '../context/AuthContext';
import type { IFarmer, IPlot, ISoilReading, IFertilizerReport } from '../types/database';

export interface IFarmerPlotWithData extends IPlot {
  latestReading?: ISoilReading;
  latestReport?: IFertilizerReport;
}

export function useFarmerData(): { 
  farmer: IFarmer | null; 
  plots: IFarmerPlotWithData[]; 
  loading: boolean; 
} {
  const { user } = useAuth();
  const [farmer, setFarmer] = useState<IFarmer | null>(null);
  const [loading, setLoading] = useState(true);

  // Get farmer profile from user email/phone
  useEffect(() => {
    if (!user?.email && !user?.id) {
      setLoading(false);
      return;
    }

    const fetchFarmer = async () => {
      try {
        const allFarmers = await db.farmers.toArray();
        
        // Try to match by email, phone, or user ID
        const matched = allFarmers.find(f => 
          f.id === user.id ||
          (user.email && f.phone?.replace(/\D/g, '') === user.email.replace(/\D/g, '').replace('@cropwise.farmer', '')) ||
          (user.email && f.name.toLowerCase().includes(user.email.split('@')[0].toLowerCase()))
        );
        
        setFarmer(matched || null);
      } catch (err) {
        console.error('Failed to fetch farmer:', err);
        setFarmer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [user?.email, user?.id]);

  // Get plots with latest readings and reports
  const plots = useLiveQuery(async () => {
    if (!farmer) return [];
    
    const allPlots = await db.plots.where('farmerId').equals(farmer.id).toArray();
    const activePlots = allPlots.filter(p => !p.isDeleted);
    
    const plotsWithData = await Promise.all(activePlots.map(async (plot) => {
      const readings = await db.soilReadings
        .where('plotId').equals(plot.id)
        .reverse()
        .sortBy('collectedAt');
      
      const reports = await db.fertilizerReports
        .where('plotId').equals(plot.id)
        .reverse()
        .sortBy('generatedAt');

      return {
        ...plot,
        latestReading: readings[0],
        latestReport: reports[0],
      };
    }));

    return plotsWithData;
  }, [farmer?.id]) as IFarmerPlotWithData[];

  return { farmer, plots, loading };
}