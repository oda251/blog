export interface Tweet {
  id: string;
  content: string;
  article?: string;
  author: string;
  ip_address: string;
  created_at?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface TweetWithTags extends Tweet {
  tag_id_list: string[];
}

export interface TagMap {
  [key: string]: string;
}
