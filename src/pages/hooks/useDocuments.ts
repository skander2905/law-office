import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

export interface DocumentFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  fileurl: string;
}

export const useDocuments = (caseId: string | null) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data: documentsData, error: documentsError } = await supabase
          .from("documents")
          .select("*")
          .eq("caseid", caseId)
          .order("uploaddate", { ascending: false });

        if (documentsError) {
          setError(documentsError.message);
        } else {
          setDocuments(
            documentsData.map((doc) => ({
              id: doc.id,
              name: doc.name,
              uploadDate: new Date(doc.uploadDate).toLocaleDateString(),
              size: (doc.filesize / (1024 * 1024)).toFixed(2) + " MB",
              fileurl: doc.fileurl,
            }))
          );
        }
      } catch (err) {
        setError("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [caseId]);

  // Real-time subscription for document changes
  useEffect(() => {
    if (!caseId) return;

    const documentsChannel = supabase
      .channel("case-documents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          filter: `caseid=eq.${caseId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newDoc = payload.new as any;
            setDocuments((prev) => [
              {
                id: newDoc.id,
                name: newDoc.name,
                uploadDate: new Date(newDoc.uploadDate).toLocaleDateString(),
                size: (newDoc.filesize / (1024 * 1024)).toFixed(2) + " MB",
                fileurl: newDoc.fileurl,
              },
              ...prev,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      documentsChannel.unsubscribe();
    };
  }, [caseId]);

  const uploadDocument = async (
    file: File,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!caseId) {
      return { success: false, error: "No case ID provided" };
    }

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${caseId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("case-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("case-documents")
        .getPublicUrl(fileName);

      // Insert document record
      const { error: insertError } = await supabase.from("documents").insert({
        caseid: caseId,
        name: file.name,
        fileurl: urlData.publicUrl,
        filesize: file.size,
        mimetype: file.type,
        uploadedby: userId,
      });

      if (insertError) throw insertError;

      // Create activity for document upload
      await supabase.from("activities").insert({
        caseid: caseId,
        activitytype: "document_uploaded",
        title: "Document uploaded",
        description: `${file.name} - ${new Date().toLocaleDateString()}`,
        metadata: {
          fileName: file.name,
          filesize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        },
        createdby: userId,
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to upload document" };
    }
  };

  const downloadDocument = async (fileurl: string, fileName: string) => {
    try {
      const response = await fetch(fileurl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw new Error("Failed to download file");
    }
  };

  return { documents, loading, error, uploadDocument, downloadDocument };
};

