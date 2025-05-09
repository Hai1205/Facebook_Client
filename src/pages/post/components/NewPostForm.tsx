import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Video } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import NewPostDialog from "./NewPostDialog";

interface NewPostFormProps {
  isPostFormOpen: boolean;
  setIsPostFormOpen: (value: boolean) => void;
}

const NewPostForm = ({
  isPostFormOpen,
  setIsPostFormOpen,
}: NewPostFormProps) => {
  const { userAuth } = useAuthStore();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={userAuth?.avatarPhotoUrl}
              alt={userAuth?.fullName}
            />

            <AvatarFallback className="bg-zinc-700 text-white">
              {userAuth?.fullName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
            <DialogTrigger className="w-full">
              <Input
                placeholder={`what's on your mind, ${userAuth?.fullName}`}
                readOnly
                className="cursor-pointer rounded-full h-12  dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 dark:placeholder:text-gray-400  "
              />
              <Separator className="my-2 dark:bg-slate-400" />

              <div className="flex justify-between ">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <ImageIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="dark:text-slate-100">Photo</span>
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <Video className="h-5 w-5 text-red-500 mr-2" />
                  <span className="dark:text-slate-100">Video</span>
                </Button>

                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                >
                  <Laugh className="h-5 w-5 text-orange-500 mr-2" />

                  <span className="dark:text-slate-100">Feelings</span>
                </Button>
              </div>
            </DialogTrigger>

            <NewPostDialog isPostFormOpen={isPostFormOpen} setIsPostFormOpen={setIsPostFormOpen} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewPostForm;
