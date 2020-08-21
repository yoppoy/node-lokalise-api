//import { RequestError, Response, Options } from "got";
//const got = require("got");
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const axios = require("axios");
const pkg = require("../../package.json");
import { LokaliseApi } from "../lokalise/lokalise";

export class ApiRequest {
  private urlRoot: string = "https://api.lokalise.com/api2/";
  public promise: Promise<any>;
  public params: any = {};

  /* istanbul ignore next */
  constructor(uri: any, method: any, body: any = null, params: any = {}) {
    this.params = params;
    this.promise = this.createPromise(uri, method, body);
    return this;
  }

  createPromise(uri: any, method: any, body: any): Promise<any> {
    const options: AxiosRequestConfig = {
      url: this.composeURI(uri),
      method: method,
      baseURL: this.urlRoot,
      headers: {
        "x-api-token": LokaliseApi.apiKey,
        "user-agent": `node-lokalise-api/${pkg.version}`,
      },
      /*agent: false,
      throwHttpErrors: false,
      decompress: false,*/
    };

    if (Object.keys(this.params).length > 0) {
      options.params = new URLSearchParams(this.params).toString();
    }

    if (method != "GET" && body) {
      options.data = JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
      axios(options)
        .then((response: AxiosResponse) => {
          const responseJSON = response.data;
          if (
            responseJSON["error"] ||
            (responseJSON["errors"] && responseJSON["errors"].length != 0)
          ) {
            /* istanbul ignore next */
            reject(
              responseJSON["error"] || responseJSON["errors"] || responseJSON
            );
            return;
          }
          // Workaround to pass header parameters
          const result: any = {};
          result["headers"] = response.headers;
          result["body"] = response.data;
          resolve(result);
          return;
        })
        .then((error: AxiosError) => {
          reject(error.code);
          /* istanbul ignore next */
          return error;
        })
        .catch((error: any) => {
          reject(error);
          return error;
        });
    });
  }

  protected composeURI(uri: any): string {
    const regexp: RegExp = /{(!{0,1}):(\w*)}/g;
    return uri.replace(regexp, this.mapUriParams(this.params));
  }

  protected mapUriParams(params: any) {
    return (_entity: any, isMandaratory: any, paramName: any): any => {
      if (params[paramName] != null) {
        const t_param = params[paramName];
        delete this.params[paramName];
        return t_param;
      } else {
        /* istanbul ignore if */
        if (isMandaratory == "!") {
          throw new Error("Required param " + paramName);
        } else {
          return "";
        }
      }
    };
  }
}
