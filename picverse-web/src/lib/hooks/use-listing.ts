"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useListing = <T extends Object>(dataSource: Array<T> = []) => {
  const [displayItems, setDisplayItems] = useState<Array<T>>([]);

  useEffect(() => {
    if (dataSource) {
      setDisplayItems(dataSource);
    }
  }, [dataSource]);

  const onSearchChange = useCallback(
    useDebouncedCallback((query: string) => {
      if (query) {
        setDisplayItems(searchFilterByStringQuery<T>(query, dataSource));
      } else {
        setDisplayItems(dataSource);
      }
    }, 300),
    [dataSource],
  );

  const onFieldFilterChange = useCallback(
    (fieldName: keyof T, query: "-" | string) => {
      if (query === "-") {
        setDisplayItems(dataSource);
      } else {
        setDisplayItems(searchFilterByField<T>(query, fieldName, dataSource));
      }
    },
    [dataSource],
  );

  const swapItems = useCallback((selfId: string, targetId: string, compareByField: (item: T) => string | number) => {
    setDisplayItems((prevItems) => {
      const newItems = [...prevItems];

      const index1 = newItems.findIndex((item) => compareByField(item) === selfId);
      const index2 = newItems.findIndex((item) => compareByField(item) === targetId);

      if (index1 >= 0 && index2 >= 0) {
        [newItems[index1], newItems[index2]] = [newItems[index2], newItems[index1]];
      }

      return newItems;
    });
  }, []);

  const insertAfter = useCallback((selfId: string, targetId: string, compareByField: (item: T) => string | number) => {
    setDisplayItems((prevItems) => {
      const newItems = [...prevItems];

      const indexSelf = newItems.findIndex((item) => compareByField(item) === selfId);
      const indexTarget = newItems.findIndex((item) => compareByField(item) === targetId);

      if (indexSelf >= 0 && indexTarget >= 0 && indexSelf !== indexTarget) {
        const [itemToMove] = newItems.splice(indexSelf, 1);

        newItems.splice(indexTarget + 1, 0, itemToMove);
      }

      return newItems;
    });
  }, []);

  const groupSort = useCallback((groupByField: (item: T) => string | number, groupOrder: Array<string | number>) => {
    setDisplayItems((prevItems) => {
      const newItems = [...prevItems].sort((a, b) => {
        const groupA = groupByField(a);
        const groupB = groupByField(b);

        const indexA = groupOrder.indexOf(groupA);
        const indexB = groupOrder.indexOf(groupB);

        const adjustedIndexA = indexA === -1 ? groupOrder.length : indexA;
        const adjustedIndexB = indexB === -1 ? groupOrder.length : indexB;

        return adjustedIndexA - adjustedIndexB;
      });

      return newItems;
    });
  }, []);

  const searchFilterByStringQuery = <T extends Object>(query: string, dataSource?: Array<T>): SetStateAction<any> => {
    return (prevState: Array<T>) => {
      return (dataSource || prevState).filter((item: T) => {
        return Object.values(item).some((fieldValue) =>
          fieldValue?.toString().toLowerCase().includes(query.toLowerCase()),
        );
      });
    };
  };

  const searchFilterByField = <T>(query: string, field: keyof T, dataSource?: Array<T>): SetStateAction<any> => {
    return (prevState: Array<T>) => {
      return (dataSource || prevState).filter((item: T) => {
        return item[field]?.toString().toLowerCase().includes(query.toLowerCase());
      });
    };
  };

  return {
    displayItems,
    setDisplayItems,
    onSearchChange,
    onFieldFilterChange,
    swapItems,
    insertAfter,
    groupSort,
  };
};
