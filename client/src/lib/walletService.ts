// Wrapper to provide typed access to the JS walletService implementation in ../../lib
// The runtime implementation is a JS file at client/lib/walletService.js. Importing that
// directly can cause TS to complain if a declaration isn't found, so we silence the import
// type-check (the actual runtime import still works) and re-export the runtime object as any.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as impl from '../../lib/walletService';

// The implementation file is a JS module that exports `walletService`.
// We re-export it as `any` to satisfy TypeScript while keeping runtime behavior.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const walletService: any = (impl as any).walletService;
