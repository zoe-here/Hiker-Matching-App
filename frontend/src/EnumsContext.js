import React, { createContext, useContext, useEffect, useState } from "react";

const EnumsContext = createContext();

export const EnumsProvider = ({ children }) => {
  const [enums, setEnums] = useState({
    genderOptions: [],
    experienceLevels: [],
    paceOptions: [],
    regionOptions: [],
    languageOptions: [],
    hikeTypeOptions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnums() {
      try {
        const [genders, exps, paces, regions, langs, hikes] = await Promise.all([
          fetch("/v1/api/enums/gender").then((r) => r.json()),
          fetch("/v1/api/enums/experience-level").then((r) => r.json()),
          fetch("/v1/api/enums/pace").then((r) => r.json()),
          fetch("/v1/api/enums/region").then((r) => r.json()),
          fetch("/v1/api/enums/language").then((r) => r.json()),
          fetch("/v1/api/enums/hike-type").then((r) => r.json()),
        ]);
        setEnums({
          genderOptions: genders,
          experienceLevels: exps,
          paceOptions: paces,
          regionOptions: regions,
          languageOptions: langs,
          hikeTypeOptions: hikes,
        });
      } catch (error) {
        // Optionally handle error globally
      } finally {
        setLoading(false);
      }
    }
    fetchEnums();
  }, []);

  return (
    <EnumsContext.Provider value={{ enums, loading }}>
      {children}
    </EnumsContext.Provider>
  );
};

export const useEnums = () => useContext(EnumsContext);
