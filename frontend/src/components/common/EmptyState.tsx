export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-700">
    <span className="text-4xl">🔍</span>
    <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
  </div>
);

export default EmptyState;
