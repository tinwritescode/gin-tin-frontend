import {
  CreateParams,
  CreateResponse,
  CustomParams,
  CustomResponse,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  UpdateParams,
  UpdateResponse,
  type BaseRecord,
  type DataProvider,
} from "@refinedev/core";
import qs from "query-string";
import { generateFilter, generateSort, kyInstance } from "./utils";

const stringify = qs.stringify;

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (
  apiUrl: string,
  httpClient: typeof kyInstance = kyInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
    pagination,
    filters,
    sorters,
    meta,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

    const { headers: headersFromMeta, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const queryFilters = generateFilter(filters);

    const query: {
      _start?: number;
      _end?: number;
      _sort?: string;
      _order?: string;
    } = {};

    if (mode === "server") {
      query._start = (current - 1) * pageSize;
      query._end = current * pageSize;
    }

    const generatedSort = generateSort(sorters);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const combinedQuery = { ...query, ...queryFilters };
    const urlWithQuery = Object.keys(combinedQuery).length
      ? `${url}?${stringify(combinedQuery)}`
      : url;

    const { headers, json } = await httpClient<TData[]>(urlWithQuery, {
      headers: headersFromMeta,
      method: requestMethod,
    });

    const total = headers.get("x-total-count");

    const data = await json();

    return {
      data,
      total: total ? Number(total) : data.length,
    };
  },

  getMany: async <TData extends BaseRecord = BaseRecord>({
    resource,
    ids,
    meta,
  }: GetManyParams): Promise<GetManyResponse<TData>> => {
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const body = await httpClient<TData[]>(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
      {
        headers,
        method: requestMethod,
      }
    ).json();

    return {
      data: body,
    };
  },

  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    variables,
    meta,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const url = `${apiUrl}/${resource}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "post";

    const { json } = await httpClient<TData>(url, {
      method: requestMethod,
      json: variables,
      headers,
    });

    const data = await json();

    return {
      data,
    };
  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    id,
    variables,
    meta,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "patch";

    const { json } = await httpClient<TData>(url, {
      method: requestMethod,
      json: variables,
      headers,
    });

    const data = await json();

    return {
      data,
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({
    resource,
    id,
    meta,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypes) ?? "get";

    const { json } = await httpClient<TData>(url, {
      method: requestMethod,
      headers,
    });

    const data = await json();

    return {
      data,
    };
  },

  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({
    resource,
    id,
    variables,
    meta,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const { json } = await httpClient<TData>(url, {
      method: requestMethod,
      json: variables,
      headers,
    });

    const data = await json();

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async <TData extends BaseRecord = BaseRecord>({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }: CustomParams): Promise<CustomResponse<TData>> => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    let response;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        response = await httpClient[method]<TData>(url, {
          headers,
          json: payload,
        });
        break;
      case "delete":
        response = await httpClient.delete<TData>(url, {
          json: payload,
          headers: headers,
        });
        break;
      default:
        response = await httpClient.get<TData>(requestUrl, {
          headers,
        });
        break;
    }

    const { json } = response;

    const data = await json();

    return Promise.resolve({ data: data });
  },
});
