import { ModalType } from "./modal-type";

export type ModalData =
| {
    type: ModalType.AddSubscription;
    data?: {};
}
| {
    type: ModalType.ConfirmDeleteSubscription;
    data?: { subId : number, subName : string };
};
