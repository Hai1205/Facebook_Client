import type { ReactNode } from "react";
import { Music, AlertCircle, Disc3, Users, FileUser } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface MessageProps {
  message: string;
}

const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-800 rounded-full p-4 mb-4">
        {icon || <AlertCircle className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>
    </div>
  );
};

const AlbumsEmptyState = ({ message }: MessageProps) => {
  return (
    <EmptyState
      icon={<Disc3 className="h-8 w-8 text-gray-400" />}
      title="No Albums Found"
      description={message}
    />
  );
};

const SongsEmptyState = ({ message }: MessageProps) => {
  return (
    <EmptyState
      icon={<Music className="h-8 w-8 text-gray-400" />}
      title="No Songs Found"
      description={message}
    />
  );
};

const UserEmptyState = () => {
  return (
    <div className=" h-[calc(100vh-420px)]">
      <EmptyState
      icon={<Users className="h-8 w-8 text-gray-400" />}
        title="No Users Found"
        description="We couldn't find the user you're looking for. They may have deleted their account or the URL might be incorrect."
      />
    </div>
  );
};

const ApplicationsEmptyState = () => {
  return (
    <div className=" h-[calc(100vh-420px)]">
      <EmptyState
      icon={<FileUser className="h-8 w-8 text-gray-400" />}
        title="No Applications Found"
        description="We couldn't find the application you're looking for. They may have deleted their account or the URL might be incorrect."
      />
    </div>
  );
};

export { EmptyState, SongsEmptyState, AlbumsEmptyState, UserEmptyState, ApplicationsEmptyState };
