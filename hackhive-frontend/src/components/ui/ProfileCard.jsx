import { Card } from "./Card";
import { Badge } from "./Badge";

export function ProfileCard({
    avatarUrl,
    name,
    role,
    email,
    phone,
    bio,
    actions,
    className = "",
    ...props
}) {
    const initials = name
        ? name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "U";

    return (
        <Card className={`p-5 transition-all duration-200 hover:shadow-md ${className}`} {...props}>
            <div className="flex items-start gap-4">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name || "Profile avatar"}
                        className="size-12 shrink-0 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-sm text-white shadow-2xs">
                        {initials}
                    </div>
                )}

                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{name || "User"}</h4>
                        {role && <Badge variant="default">{role}</Badge>}
                    </div>

                    {email && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>}
                    {phone && <p className="text-[11px] text-slate-400 dark:text-slate-500">{phone}</p>}
                    {bio && <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{bio}</p>}
                </div>
            </div>

            {actions && <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">{actions}</div>}
        </Card>
    );
}

export default ProfileCard;
