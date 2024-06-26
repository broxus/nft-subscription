type TIP4_2JSON = {
  type: string;
  name: string;
  description: string;
  preview: { source: string; mimetype: string };
  files: { source: string; mimetype: string }[];
  external_url: string;
};

const EXTERNAL_URL = '';
const COLLECTION_LOGO = '';

export const Collection: TIP4_2JSON = {
  type: 'Basic NFT Collection',
  name: 'Collection',
  description: 'This is description',
  preview: {
    source: COLLECTION_LOGO,
    mimetype: 'image/jpeg',
  },
  files: [
    {
      source: COLLECTION_LOGO,
      mimetype: 'image/jpeg',
    },
  ],
  external_url: EXTERNAL_URL,
};
