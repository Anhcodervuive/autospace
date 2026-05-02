import '@autospace/network/next-auth';

// Allow React Three Fiber intrinsic JSX elements when compiling workspace source imports.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
