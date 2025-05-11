import { useState, Fragment } from "react";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePostStore } from "@/stores/usePostStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "react-toastify";
import { REPORT_TYPE } from "@/utils/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportModalProps {
  contentId: string;
  contentType: REPORT_TYPE;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ReportModal({
  contentId,
  contentType,
  isOpen,
  onOpenChange,
}: ReportModalProps) {
  const { report } = usePostStore();
  const { userAuth } = useAuthStore();

  const [reportReason, setReportReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const getTitle = () => {
    switch (contentType) {
      case "POST":
        return "Report Post";
      case "COMMENT":
        return "Report Comment";
      case "USER":
        return "Report User";
      case "STORY":
        return "Report Story";
      default:
        return "Report Content";
    }
  };

  const getDescription = () => {
    switch (contentType) {
      case "POST":
        return "Please select a reason why you're reporting this post";
      case "COMMENT":
        return "Please select a reason why you're reporting this comment";
      case "USER":
        return "Please select a reason why you're reporting this user";
      case "STORY":
        return "Please select a reason why you're reporting this story";
      default:
        return "Please select a reason for your report";
    }
  };

  const getReportOptions = () => {
    const commonOptions = [
      {
        id: "spam",
        title: "Spam",
        description: "Posting unwanted or repetitive content",
      },
      {
        id: "inappropriate",
        title: "Inappropriate Content",
        description: "Content that violates community guidelines",
      },
      {
        id: "harassment",
        title: "Harassment",
        description: "Bullying or targeted attacks against individuals",
      },
      {
        id: "misinformation",
        title: "False Information",
        description: "Content that contains false or misleading information",
      },
      {
        id: "hate_speech",
        title: "Hate Speech",
        description: "Content that promotes hatred or violence",
      },
    ];

    switch (contentType) {
      case "POST":
        return [
          ...commonOptions,
          {
            id: "intellectual_property",
            title: "Intellectual Property Violation",
            description: "Content that violates copyright or trademark rights",
          },
          {
            id: "violence",
            title: "Violence",
            description: "Content that depicts or promotes violence",
          },
          {
            id: "other",
            title: "Other",
            description: "Please specify in the additional information",
          },
        ];
      case "COMMENT":
        return [
          ...commonOptions,
          {
            id: "off_topic",
            title: "Off-topic",
            description: "Comment is not relevant to the discussion",
          },
          {
            id: "other",
            title: "Other",
            description: "Please specify in the additional information",
          },
        ];
      case "USER":
        return [
          ...commonOptions,
          {
            id: "fake_account",
            title: "Fake Account",
            description: "This account appears to be impersonating someone",
          },
          {
            id: "suspicious_activity",
            title: "Suspicious Activity",
            description: "This account is engaging in suspicious behavior",
          },
          {
            id: "other",
            title: "Other",
            description: "Please specify in the additional information",
          },
        ];
      case "STORY":
        return [
          ...commonOptions,
          {
            id: "other",
            title: "Other",
            description: "Please specify in the additional information",
          },
        ];
      default:
        return commonOptions;
    }
  };

  const handleSubmit = async () => {
    if (userAuth) {
      const formData = new FormData();
      formData.append("contentType", contentType);
      formData.append("reason", reportReason);
      formData.append("additionalInfo", additionalInfo);

      const result = await report(userAuth.id as string, contentId, formData);

      if (result) {
        toast.success(result);
      }

      onOpenChange(false);
      setReportReason("");
      setAdditionalInfo("");
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (reportReason === optionId) {
      setReportReason("");
    }
  };

  const reportOptions = getReportOptions();

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black bg-opacity-75" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-zinc-900 text-gray-100 border border-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6"
                  >
                    {getTitle()}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">{getDescription()}</p>
                  </div>

                  <div className="py-4">
                    <div className="h-[200px] pr-2 my-2 overflow-y-auto">
                      <ScrollArea className="h-[200px]">
                        <RadioGroup
                          value={reportReason}
                          onChange={(value) => {
                            setReportReason(value);
                          }}
                          className="space-y-1"
                        >
                          {reportOptions.map((option) => (
                            <RadioGroup.Option
                              key={option.id}
                              value={option.id}
                              onClick={() => handleOptionClick(option.id)}
                              className={({ active, checked }) =>
                                `${
                                  active
                                    ? "ring-2 ring-gray-600 ring-opacity-60 ring-offset-2 ring-offset-gray-800"
                                    : ""
                                }
                                ${
                                  checked
                                    ? "bg-gray-800 bg-opacity-75 text-white"
                                    : "bg-gray-900"
                                }
                                relative flex cursor-pointer rounded-md p-1.5 hover:bg-gray-800 focus:outline-none`
                              }
                            >
                              {({ checked }) => (
                                <div className="flex w-full items-start space-x-3">
                                  <div className="flex-shrink-0 text-white">
                                    <div
                                      className={`
                                        h-4 w-4 rounded-full border ${
                                          checked
                                            ? "border-gray-200 bg-gray-200"
                                            : "border-gray-600"
                                        }
                                        flex items-center justify-center
                                      `}
                                    >
                                      {checked && (
                                        <div className="h-2 w-2 rounded-full bg-gray-900" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid gap-0.5 leading-none">
                                    <RadioGroup.Label
                                      as="p"
                                      className="text-sm font-medium"
                                    >
                                      {option.title}
                                    </RadioGroup.Label>

                                    <RadioGroup.Description
                                      as="span"
                                      className="text-xs text-gray-400"
                                    >
                                      {option.description}
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </RadioGroup>
                      </ScrollArea>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="additional-info"
                        className="text-sm font-medium mb-2 block"
                      >
                        Additional Information
                      </label>

                      <Textarea
                        id="additional-info"
                        placeholder="Please provide more details about your report..."
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="bg-[rgb(58,59,60)] border-gray-700 focus:border-gray-600 focus:ring-gray-600 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onOpenChange(false)}
                      className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 bg-gray-900"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={!reportReason}
                    >
                      Submit Report
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
