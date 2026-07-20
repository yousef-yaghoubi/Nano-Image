function RoleBadge({
  currentRole,
  roleLabel,
}: {
  currentRole: string;
  roleLabel: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="text-sm font-medium">{currentRole}:</span>
      <span className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold">
        {roleLabel}
      </span>
    </div>
  );
}

export default RoleBadge;
