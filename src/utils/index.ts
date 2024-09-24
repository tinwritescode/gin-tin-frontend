import bourne from "@hapi/bourne";
import type { CrudFilters, CrudOperators, CrudSorting } from "@refinedev/core";
import ky from "ky";
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from "../authProvider";
import { DATA_PROVIDER_BASE_URL } from "../constant";
import axios from "axios";

export const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    default:
      return "";
  }
};

export const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `[@refinedev/simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`
        );
      }

      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sorters.map((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return;
};

export const kyInstance = ky.create({
  parseJson: bourne.parse,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
              throw new Error("No refresh token found");
            }

            const data = await fetch(`${DATA_PROVIDER_BASE_URL}/refresh`, {
              method: "POST",
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const refreshResponse = await data.json();

            const newToken = refreshResponse.access_token;
            localStorage.setItem(TOKEN_KEY, newToken);
            localStorage.setItem(
              REFRESH_TOKEN_KEY,
              refreshResponse.refresh_token
            );

            request.headers.set("Authorization", `Bearer ${newToken}`);
            return ky(request);
          } catch (error) {
            localStorage.removeItem(TOKEN_KEY);

            window.location.href = "/login";
          }
        }
        return response;
      },
    ],
  },
});
