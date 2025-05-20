// src/contexts/FireRiskContext.js
import React, { createContext, useState } from "react";

export const FireRiskContext = createContext({
  fireRiskLabel: "",
  setFireRiskLabel: () => {},
});

export const FireRiskProvider = ({ children }) => {
  const [fireRiskLabel, setFireRiskLabel] = useState("");
  return (
    <FireRiskContext.Provider value={{ fireRiskLabel, setFireRiskLabel }}>
      {children}
    </FireRiskContext.Provider>
  );
};
