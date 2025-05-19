import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { POST, USER } from "@/utils/interface";
import { useAuthStore } from "@/stores/useAuthStore";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostCard from "../PostCard";

interface ViewPostModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  post: POST;
}

export function ViewPostModal({ isOpen, onOpenChange, post }: ViewPostModalProps) {
  const { userAuth } = useAuthStore();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!post) {
      return;
    }

    setIsLiked(post.likes.includes(userAuth as USER))

  }, [post, userAuth]);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md md:max-w-xl transform overflow-hidden rounded-2xl bg-zinc-900 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between border-b border-zinc-800 p-4"
                >
                  <h3 className="text-lg font-medium text-white">
                    Post by {post?.user?.fullName}
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </Dialog.Title>

                <div
                  className="relative"
                  style={{ height: "calc(100vh - 200px)" }}
                >
                  <ScrollArea className="h-full w-full">
                    <div className="p-2">
                      <PostCard
                        post={post}
                        isLiked={isLiked}
                        onShare={() => {}}
                        onComment={() => {}}
                        onLike={handleLike}
                      />
                    </div>
                  </ScrollArea>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
