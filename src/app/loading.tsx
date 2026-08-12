import { CubeLoaderScreen } from "@/components/ui/CubeLoader";

/**
 * Root loading state.
 *
 * Routes that have a predictable layout get a skeleton instead (see
 * parent/loading.tsx, modules/loading.tsx), a skeleton shaped like the content
 * stops the page jumping when data lands, which a spinner can't do. The cube
 * loader is for the cases where there's no layout to mimic yet.
 */
export default function RootLoading() {
  return <CubeLoaderScreen label="Loading the Primer" />;
}
