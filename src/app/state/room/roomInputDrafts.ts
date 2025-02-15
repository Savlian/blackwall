import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { Descendant } from 'slate';
import { EncryptedAttachmentInfo } from 'browser-encrypt-attachment';
import { IEventRelation } from 'matrix-js-sdk';
import { createUploadAtomFamily } from '../upload';
import { TUploadContent } from '../../utils/matrix';

export type TUploadMetadata = {
  spoiled: boolean;
};

export type TUploadItem = {
  file: TUploadContent;
  originalFile: TUploadContent;
  metadata: TUploadMetadata;
  encInfo: EncryptedAttachmentInfo | undefined;
};

export type UploadListAction =
  | {
      type: 'PUT';
      items: TUploadItem[];
    }
  | {
      type: 'DELETE';
      items: TUploadItem[];
    }
  | {
      type: 'MODIFY';
      item: TUploadItem;
      metadata: TUploadMetadata;
    };

export const createUploadListAtom = () => {
  const baseListAtom = atom<TUploadItem[]>([]);
  return atom<TUploadItem[], [UploadListAction], undefined>(
    (get) => get(baseListAtom),
    (get, set, action) => {
      const items = get(baseListAtom);
      if (action.type === 'DELETE') {
        set(
          baseListAtom,
          items.filter((item) => !action.items.includes(item))
        );
        return;
      }
      if (action.type === 'PUT') {
        set(baseListAtom, [...items, ...action.items]);
        return;
      }
      if (action.type === 'MODIFY') {
        set(baseListAtom, items.map((item) => item === action.item ? {...item, metadata: action.metadata} : item));
      }
    }
  );
};
export type TUploadListAtom = ReturnType<typeof createUploadListAtom>;

export const roomIdToUploadItemsAtomFamily = atomFamily<string, TUploadListAtom>(
  createUploadListAtom
);

export const roomUploadAtomFamily = createUploadAtomFamily();

export type RoomIdToMsgAction =
  | {
      type: 'PUT';
      roomId: string;
      msg: Descendant[];
    }
  | {
      type: 'DELETE';
      roomId: string;
    };

const createMsgDraftAtom = () => atom<Descendant[]>([]);
export type TMsgDraftAtom = ReturnType<typeof createMsgDraftAtom>;
export const roomIdToMsgDraftAtomFamily = atomFamily<string, TMsgDraftAtom>(() =>
  createMsgDraftAtom()
);

export type IReplyDraft = {
  userId: string;
  eventId: string;
  body: string;
  formattedBody?: string | undefined;
  relation?: IEventRelation | undefined;
};
const createReplyDraftAtom = () => atom<IReplyDraft | undefined>(undefined);
export type TReplyDraftAtom = ReturnType<typeof createReplyDraftAtom>;
export const roomIdToReplyDraftAtomFamily = atomFamily<string, TReplyDraftAtom>(() =>
  createReplyDraftAtom()
);
