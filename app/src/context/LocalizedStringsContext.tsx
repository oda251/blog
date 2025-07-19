// LocalizedStringsContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

export type LocalizedStrings = {
  tweetEditor: {
    author: string;
    content: string;
    tags: string;
    post: string;
    posting: string;
    error: {
      required: string;
    };
  };
  tagSelector: {
    placeholder: string;
    addTag: string;
    error: {
      empty: string;
      tooLong: string;
      duplicate: string;
      network: string;
      generic: string;
    };
    noTags: string;
  };
};

const LocalizedStringsContext = createContext<LocalizedStrings | undefined>(undefined);

export const LocalizedStringsProvider = ({
  value,
  children,
}: {
  value: LocalizedStrings;
  children: ReactNode;
}) => (
  <LocalizedStringsContext.Provider value={value}>
    {children}
  </LocalizedStringsContext.Provider>
);

export function useLocalizedStrings(): LocalizedStrings {
  const ctx = useContext(LocalizedStringsContext);
  if (!ctx) throw new Error('useLocalizedStrings must be used within a LocalizedStringsProvider');
  return ctx;
}