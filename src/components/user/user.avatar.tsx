import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AccountAvatar } from "thirdweb/react";

const fallbackAvatar = (id: string) => {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${id.toLowerCase()}`;
};

export const UserAvatar = ({
  user,
  className,
}: {
  user: {
    id: string;
    avatar?: string | null;
  };
  className?: string;
}) => {
  return (
    <Avatar className={cn(className, "h-8 w-8 rounded-sm")}>
      <AvatarImage src={user.avatar ?? fallbackAvatar(user.id)} alt={user.id} />
      <AvatarFallback className="rounded-lg"></AvatarFallback>
    </Avatar>
  );
};

export const UserWalletAvatar = ({
  user,
  className,
}: {
  user: {
    address: string;
  };
  className?: string;
}) => {
  const FallbackWalletImage = () => (
    <img
      src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.address.toLowerCase()}`}
      alt={user.address}
      className={cn("aspect-square size-5 rounded-lg", className)}
    />
  );

  return (
    <div>
      <AccountAvatar
        className={cn("aspect-square size-5 rounded-lg", className)}
        fallbackComponent={<FallbackWalletImage />}
        loadingComponent={<FallbackWalletImage />}
      />
    </div>
  );
};
