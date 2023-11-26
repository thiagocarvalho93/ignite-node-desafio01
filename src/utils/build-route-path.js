// regex: /users/:id

export function buildRoutePath(path) {
  const routeParamsRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(routeParamsRegex, "(?<$1>[a-z0-9-_]+)");
  // Pulo do gato: o ?<$1> pega a posição 1 do retorno da regex aplicada e usa como nome do grupo.

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
