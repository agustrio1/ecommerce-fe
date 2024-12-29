export interface GetCategory {
  id?: string;
  slug: string;
  name: string;
}

export interface CreateCategory {
  slug: string;
  name: string;
  image?: string;
}

export interface UpdateCategory {
  id: string;
  slug: string;
  name: string;
  image?:string;
}
