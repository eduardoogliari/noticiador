import { ModalType } from "./modal-type";

export type ModalData =
| {
    type: ModalType.AddSubscription;
    data?: { title ?: string };
}
| {
    type: ModalType.ConfirmDeleteSubscription;
    data?: { subId : number, subName : string, title ?: string };
}
| {
    type: ModalType.ConfirmEmptyBin;
    data?: { title ?: string };
};
