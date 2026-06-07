declare const __brand: unique symbol;

type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type MovieId = Brand<number, "MovieId">;
export type UserId = Brand<string, "UserId">;
export type CollectionId = Brand<string, "CollectionId">;
export type ReviewId = Brand<string, "ReviewId">;

export function toMovieId(id: number): MovieId {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid movie id: ${id}`);
  }
  return id as MovieId;
}

export function toUserId(id: string): UserId {
  if (!id) throw new Error("Invalid user id");
  return id as UserId;
}

export function toCollectionId(id: string): CollectionId {
  if (!id) throw new Error("Invalid collection id");
  return id as CollectionId;
}
