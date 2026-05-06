
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useUrlFilters = (config = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { defaultValues = {}, numericFields = [], booleanFields = [] } = config;


  const parseValue = useCallback(
    (key, value) => {
      if (value === null || value === undefined || value === "") {
        return defaultValues[key] ?? null;
      }


      if (numericFields.includes(key)) {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? (defaultValues[key] ?? null) : parsed;
      }


      if (booleanFields.includes(key)) {
        if (value === "0" || value === 0) return 0;
        if (value === "1" || value === 1) return 1;
        return defaultValues[key] ?? null;
      }

      return value;
    },
    [defaultValues, numericFields, booleanFields]
  );


  const getParam = useCallback(
    (key) => {
      const value = searchParams.get(key);
      return parseValue(key, value);
    },
    [searchParams, parseValue]
  );


  const params = useMemo(() => {
    const result = {};


    Object.keys(defaultValues).forEach((key) => {
      result[key] = defaultValues[key];
    });


    searchParams.forEach((value, key) => {
      result[key] = parseValue(key, value);
    });

    return result;
  }, [searchParams, defaultValues, parseValue]);


  const setParams = useCallback(
    (updates, options = {}) => {
      const { resetPage = false, replace = true } = options;

      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);


          if (resetPage && !("page" in updates)) {
            newParams.set("page", "1");
          }


          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
              newParams.delete(key);
            } else {
              newParams.set(key, String(value));
            }
          });

          return newParams;
        },
        { replace }
      );
    },
    [setSearchParams]
  );


  const resetParams = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);


  const hasActiveFilters = useMemo(() => {
    const excludeKeys = ["page", "limit", "type"];
    let hasActive = false;

    searchParams.forEach((value, key) => {
      if (!excludeKeys.includes(key) && value) {
        hasActive = true;
      }
    });

    return hasActive;
  }, [searchParams]);


  const activeFiltersCount = useMemo(() => {
    const excludeKeys = ["page", "limit", "type"];
    let count = 0;

    searchParams.forEach((value, key) => {
      if (!excludeKeys.includes(key) && value) {
        count++;
      }
    });

    return count;
  }, [searchParams]);

  return {
    params,
    getParam,
    setParams,
    resetParams,
    hasActiveFilters,
    activeFiltersCount,
    searchParams,
  };
};

export default useUrlFilters;
