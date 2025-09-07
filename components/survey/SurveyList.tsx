// List of assigned surveys for the officer
import React, { useEffect, useState } from "react";


export default function SurveyList({ surveys, selectedSurvey, onSelect }: any) {
  const [readIds, setReadIds] = useState<number[]>([]);

  // Use a separate localStorage key for officer reads so admin's read state is not affected
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("readSurveyRequests_officer");
      if (raw) setReadIds(JSON.parse(raw));
    } catch (e) {
      setReadIds([]);
    }
  }, []);

  const markRead = (id: number) => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("readSurveyRequests_officer");
      const arr = raw ? JSON.parse(raw) : [];
      if (!arr.includes(id)) {
        arr.push(id);
        localStorage.setItem("readSurveyRequests_officer", JSON.stringify(arr));
        setReadIds(arr);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleClick = (survey: any) => {
    markRead(survey.id);
    onSelect(survey);
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Assigned Applications</h3>
      <ul className="space-y-2">
        {surveys.length === 0 && <li className="p-2">No assigned surveys.</li>}
        {surveys.map((survey: any) => {
          const isNew = survey.status !== "Completed" && !readIds.includes(survey.id);
          return (
            <li
              key={survey.id}
              className={`p-2 bg-white rounded shadow cursor-pointer flex items-center justify-between ${selectedSurvey?.id === survey.id ? "border-2 border-blue-500" : ""}`}
              onClick={() => handleClick(survey)}
            >
              <div>{survey.application?.full_name || "Applicant"} <span className="text-xs text-gray-400">({survey.status})</span></div>
              {isNew && <span className="ml-3 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
