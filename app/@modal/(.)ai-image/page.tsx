"use client";
import Modal from "@/components/shared/Modal";
import SendDataPage from "@/components/shared/SendDataPage";

function Page() {
  return (
    <Modal open>
      <div className="h-fit mt-2 gap-4 flex flex-col">
        <SendDataPage />
      </div>
    </Modal>
  );
}

export default Page;
