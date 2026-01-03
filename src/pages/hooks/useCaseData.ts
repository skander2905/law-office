import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

interface CaseData {
  id: string;
  caseNumber: string;
  caseType: string;
  status: string;
  attorney: string;
  nextHearing: string;
  description: string;
}

export const useCaseData = (userId: string) => {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCaseData = async () => {
      try {
        setLoading(true);
        const { data: casesData, error: casesError } = await supabase
          .from("cases")
          .select(
            `
    *,
    lawyers (
      fullname
    )
  `
          )
          .eq("clientid", userId)
          .single();
        if (casesError) {
          setError(casesError.message);
        } else if (casesData) {
          // Type assertion for the joined lawyers data
          const lawyerData = casesData.lawyers as unknown as {
            fullname: string;
          } | null;

          setCaseData({
            id: casesData.id,
            caseNumber: casesData.casenumber,
            caseType: casesData.casetype,
            status: casesData.status,
            attorney: lawyerData?.fullname || "Not assigned",
            nextHearing: casesData.nexthearing
              ? new Date(casesData.nexthearing).toLocaleDateString()
              : "Not scheduled",
            description: casesData.description || "",
          });
        }
      } catch (err) {
        setError("Failed to fetch case data");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [userId]);

  // Real-time subscription for case updates
  useEffect(() => {
    if (!caseData?.id) return;

    const caseChannel = supabase
      .channel("case-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cases",
          filter: `id=eq.${caseData.id}`,
        },
        async (payload) => {
          const updatedCase = payload.new as any;

          // Fetch lawyer name if needed
          let lawyerName = "Not assigned";
          if (updatedCase.lawyerId) {
            const { data: lawyerData } = await supabase
              .from("lawyers")
              .select("fullName")
              .eq("id", updatedCase.lawyerId)
              .single();
            lawyerName = lawyerData?.fullName || "Not assigned";
          }

          setCaseData({
            id: updatedCase.id,
            caseNumber: updatedCase.caseNumber,
            caseType: updatedCase.caseType,
            status: updatedCase.status,
            attorney: lawyerName,
            nextHearing: updatedCase.nextHearing
              ? new Date(updatedCase.nextHearing).toLocaleDateString()
              : "Not scheduled",
            description: updatedCase.description || "",
          });
        }
      )
      .subscribe();

    return () => {
      caseChannel.unsubscribe();
    };
  }, [caseData?.id]);

  return { caseData, loading, error };
};
