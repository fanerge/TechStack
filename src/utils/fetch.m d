import originalFetch from "isomorphic-unfetch"

// 401 Unauthorized 未授权（没登录）
// 403 Forbidden 拒绝访问（登录了，没有改操作权限）
const SERVER_FETCH_TIMEOUT = 30 * 1000 //30s

//Typescript 内部已声明 RequestInit
interface BaseFetchOptions extends RequestInit {
  query?: {}
  json?: {}
  needLogin?: boolean
  wantError?: boolean
}

interface ClientFetchOptions extends BaseFetchOptions {
  serverSide?: false | null | undefined
}

// server端请求必须要header，api才能拿到 host 和 cookie 信息(实现多租户需求)
interface ServerFetchOptions extends BaseFetchOptions {
  serverSide: true
  headers: any
  timeout?: number
}

export type FetchOptions = ClientFetchOptions | ServerFetchOptions

interface APIJSON<T> {
  code: number
  message: string
  data?: T
}

const tenant = process.env.TENANT

const defaultOptions: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  credentials: "include",
}

//Typescript 内部已声明 RequestInfo
export async function fetch<T = any>(url: RequestInfo, options: FetchOptions) {
  if (options?.serverSide) {
    options.wantError = true
    if (options.headers) {
      const headers = options.headers as any
      // 不同租户配置不同 host 服务端用来隔离数据
      // sc.haowan.com
      // gd.haowan.com
      // bj.haowan.com

      headers.host = tenant 
    }
  }

  const query = options?.query
  if (query) {
    const queryArr = Object.keys(query).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`,
    )
    if (queryArr.length > 0) {
      url = `${url}?${queryArr.join("&")}`
    }
  }

  const headers = options?.headers
    ? {
        ...defaultOptions.headers,
        ...options.headers,
        "Content-Type": "application/json; charset=utf-8",
      }
    : defaultOptions.headers
  const fetchOptions: FetchOptions = options
    ? {
        ...defaultOptions,
        ...options,
        headers,
      }
    : defaultOptions

  if (options?.json) {
    fetchOptions.body = JSON.stringify(options.json)
  }

  // 发起请求
  const res = await doFetch(fetchOptions, url as string)

  const { status, statusText } = res
  if (fetchOptions.needLogin && status === 401) {
    handleError(
      {
        code: status,
        message: statusText,
      },
      url as string,
      fetchOptions.serverSide,
    )
  }
  if (!res.ok) {
    if (!fetchOptions.wantError) {
      handleError(
        {
          code: status,
          message: statusText,
        },
        url as string,
        fetchOptions.serverSide,
      )
      return {
        code: res.status,
        message: res.statusText,
      }
    } else {
      const e: any = new Error()
      e.code = res.status
      e.message = res.statusText
      e.url = url
      throw e
    }
  }

  let json: APIJSON<T>
  try {
    json = await res.json()
  } catch (err) {
    if (options?.serverSide) {
      captureError({
        message: err.message ? err.message : err.toString(),
        url: url as string,
      })
    } else {
      recordError(err, url as string)
    }
    return {
      code: 500,
      message: "JSON format error",
    }
  }

    return json
  }

  if (json.code === 401 && fetchOptions.needLogin) {
    handleError(
      {
        code: json.code,
        message: json.message,
      },
      url as string,
      fetchOptions.serverSide,
    )
  } else if (json.code === 401 && !fetchOptions.wantError) {
    // ignore and return
    return json
  } else if (json.code !== 200 && !fetchOptions.wantError) {
    if (!(json.code === 400101 && !fetchOptions.needLogin)) {
      handleError(
        {
          code: json.code,
          message: json.message,
        },
        url as string,
        fetchOptions.serverSide,
      )
    }
    return json
  } else if (json.code !== 200 && fetchOptions.wantError) {
    const e: any = new Error()
    e.code = json.code
    e.message = json.message
    e.url = url
    throw e
  } else {
    return json
  }
}

async function doFetch(fetchOptions: FetchOptions, url: string) {
  if (fetchOptions.serverSide) {
    // 防止被后台 DDOS
    if (!fetchOptions.timeout) {
      fetchOptions.timeout = SERVER_FETCH_TIMEOUT
    }
  }

  try {
    const res = await originalFetch(url, fetchOptions)
    return res
  } catch (error) {
    // ECONNRESET 这类错误，fake一个response
    return {
      ok: false,
      status: 600,
      statusText: "网络错误",
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      json: () => {}, // HACK: deceive typescript
    }
  }
}

export function handleError(
  { code, message }: APIJSON<any>,
  _url: string,
  serverSide?: FetchOptions["serverSide"],
) {
  if (code === 401 && serverSide) {
    if (typeof serverSide === "object") {
      // 在 response 中添加一个 Location
      ;(serverSide.res as any)?.redirect(
        `/sso/login?return_url=${encodeURIComponent(
          (serverSide.req as any).originalUrl,
        )}`,
      )
    }
  } else if (code === 401) {
    window.location.href = `/sso/login?return_url=${encodeURIComponent(
      window.location.href,
    )}`
  } else if (code !== 200) {
    antdMessage.error(message)
  }
}
