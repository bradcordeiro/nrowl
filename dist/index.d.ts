
type AddOptions = {
  providerkey?: string,
  priority?: -2 | -1 | 0 | 1 | 2,
  url?: string,
  event: string,
  description: string,
};

type SuccessResponse = {
  code: number,
  remaining: number,
  resetdate: Date,
};

type ErrorResponse = {
  code: number,
  message: string,
}

type ProwlResponse = SuccessResponse | ErrorResponse

export function add(apikey: string, application: string, options: AddOptions) : Promise<ProwlResponse>;
export function verify(apikey: string, providerkey: string) : Promise<ProwlResponse>;
export function retrieveToken(providerkey: string) : Promise<ProwlResponse>;
export function retrieveAPIKey(providerkey: string, token: string) : Promise<ProwlResponse>;
export function isKeyValid(apikey: string | string[], providerkey: string): Promise<boolean | boolean[]>;

