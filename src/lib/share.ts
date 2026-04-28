import { toast } from "sonner";

export const nativeShare = async (data: { title: string; text: string; url?: string }) => {
  const url = data.url ?? window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: data.title, text: data.text, url });
      return true;
    } catch (e) {
      // user cancelled — silent
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(`${data.title}\n${data.text}\n${url}`);
    toast.success("تم نسخ الرابط — يمكنك مشاركته الآن");
    return true;
  } catch {
    toast.error("تعذر مشاركة المحتوى");
    return false;
  }
};
