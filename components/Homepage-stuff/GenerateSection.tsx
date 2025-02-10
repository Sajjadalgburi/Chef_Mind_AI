import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks";
import GenerateButton from "./GenerateButton";

type Props = {
  loading: boolean;
  handleGenerate: () => void;
};

const GenerateSection: React.FC<Props> = ({ loading, handleGenerate }) => {
  const { user, loading: userLoading } = useUser();

  if (!user) {
    return (
      <Button variant="default" size="lg">
        Must Sign In to Generate
      </Button>
    );
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="text-sm sm:text-base">Processing</span>
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      </div>
    );
  }

  return <GenerateButton loading={loading} handleGenerate={handleGenerate} />;
};

export default GenerateSection;
