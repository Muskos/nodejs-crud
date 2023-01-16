type Methods = "get" | "post" | "delete" | "put";

interface Route {
  url: string;
  callback: Function;
  method: Methods;
}

type RouteStack = Route[];

const router = () => {
  function fn() {}
  fn.stack = [] as RouteStack;

  return fn;
};

export default router;

export { Methods };
