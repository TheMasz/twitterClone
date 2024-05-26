import { useRouter } from "next/navigation";
import { MdOutlineArrowBack } from "react-icons/md";

export default function BackButton() {
  const router = useRouter();
  const backHandler = () => {
    router.back();
  };
  return (
    <button
      type="button"
      onClick={backHandler}
      className="p-2 rounded-full hover:bg-[#181818]"
    >
      <MdOutlineArrowBack className="text-lg" />
    </button>
  );
}
