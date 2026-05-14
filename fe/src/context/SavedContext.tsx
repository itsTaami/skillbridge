import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase/client";

interface SavedContextType {
  saved: string[];
  toggleSaved: (tutorId: string) => Promise<void>;
  isSaved: (tutorId: string) => boolean;
}

const SavedContext = createContext<SavedContextType>({} as SavedContextType);

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    if (user?.saved) setSaved(user.saved);
    else setSaved([]);
  }, [user]);

  const toggleSaved = async (tutorId: string) => {
    if (!user) return;
    if (saved.includes(tutorId)) {
      await supabase.from("saved").delete().eq("user_id", user.id).eq("tutor_id", tutorId);
      setSaved((prev) => prev.filter((id) => id !== tutorId));
    } else {
      await supabase.from("saved").insert({ user_id: user.id, tutor_id: tutorId });
      setSaved((prev) => [...prev, tutorId]);
    }
  };

  const isSaved = (tutorId: string) => saved.includes(tutorId);

  return (
    <SavedContext.Provider value={{ saved, toggleSaved, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
