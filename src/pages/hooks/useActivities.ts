import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export interface Activity {
  id: string;
  activitytype: string;
  title: string;
  description: string;
  created_at: string;
}

export const useActivities = (caseId: string | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }
    console.log("Case ID:", caseId);
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .eq("caseid", caseId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (activitiesError) {
          setError(activitiesError.message);
        } else {
          setActivities(activitiesData || []);
        }
      } catch (err) {
        setError("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [caseId]);

  // Real-time subscription for activity changes
  useEffect(() => {
    if (!caseId) return;

    const activitiesChannel = supabase
      .channel("case-activities")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activities",
          filter: `caseId=eq.${caseId}`,
        },
        (payload) => {
          setActivities((prev) => [payload.new as Activity, ...prev]);
        }
      )
      .subscribe();

    return () => {
      activitiesChannel.unsubscribe();
    };
  }, [caseId]);

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return { activities, loading, error, formatActivityDate };
};

